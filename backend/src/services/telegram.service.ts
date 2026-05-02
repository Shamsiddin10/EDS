import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Using polling for simplicity in local development, 
// for production you'd use webhooks.
const bot = new TelegramBot(token, { polling: true });

export const sendVerificationCode = async (chatId: string, code: string) => {
  try {
    await bot.sendMessage(chatId, `Your verification code is: ${code}. It is valid for 5 minutes.`);
  } catch (error) {
    console.error('Error sending telegram message', error);
  }
};

// Bot command to capture chat_id from user's username if they interact with the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Welcome! Your chat ID is ${chatId}. Please use this or your username on the platform to link your account.`);
});

export default bot;
