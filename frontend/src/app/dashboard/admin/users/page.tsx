"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth() as any;
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        setMessage("User role updated successfully");
        fetchUsers();
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setLoadingId(userId);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setMessage("User deleted successfully");
        fetchUsers();
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage all users, assign roles, and moderate the platform.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name & Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      {u.name}
                      {u.id === currentUser?._id && <span className="ml-2 px-2 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded-full">You</span>}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      disabled={loadingId === u.id || u.role === 'SUPER_ADMIN'}
                      className="text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white px-2 py-1 disabled:opacity-50"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="DIRECTOR">Director</option>
                      <option value="ADMIN">Admin</option>
                      {u.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Admin</option>}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={loadingId === u.id || u.role === 'SUPER_ADMIN' || u.id === currentUser?._id}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
