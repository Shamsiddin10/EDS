import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import generateToken from '../utils/generateToken';
import { sendVerificationCode } from '../services/telegram.service';

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, password, role, telegramUsername, telegramChatId } = req.body;

    const userExists = await prisma.user.findUnique({ where: { phoneNumber } });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        role: role || 'STUDENT',
        telegramUsername,
        telegramChatId,
      },
    });

    // Generate 6-digit code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt,
      },
    });

    if (telegramChatId) {
      await sendVerificationCode(telegramChatId, code);
    }

    res.status(201).json({
      message: 'User registered. Please check your Telegram for the verification code.',
      userId: user.id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    const verificationRecord = await prisma.verificationCode.findUnique({
      where: { userId },
    });

    if (!verificationRecord) {
      res.status(400);
      throw new Error('No verification code found');
    }

    if (verificationRecord.code !== code) {
      res.status(400);
      throw new Error('Invalid verification code');
    }

    if (new Date() > verificationRecord.expiresAt) {
      res.status(400);
      throw new Error('Verification code expired');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    await prisma.verificationCode.delete({
      where: { id: verificationRecord.id },
    });

    res.json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const authUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        res.status(401);
        throw new Error('Account not verified. Please complete verification.');
      }

      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid phone number or password');
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
