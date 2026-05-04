import TelegramBot from 'node-telegram-bot-api';
const token = process.env.TELEGRAM_BOT_TOKEN;

let bot: any;

if (token && token !== 'YOUR_TELEGRAM_BOT_TOKEN') {
  bot = new TelegramBot(token, { polling: true });

  bot.on('polling_error', (error: any) => {
    console.error('Telegram polling error:', error.message);
  });

  bot.onText(/\/start/, (msg: any) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Welcome! Your chat ID is ${chatId}. Please use this to link your account.`);
  });
} else {
  console.log('Telegram bot token not provided, skipping bot initialization.');
}

export const sendVerificationCode = async (chatId: string, code: string) => {
  if (!bot) {
    console.warn('Telegram bot not initialized. Cannot send code.');
    return;
  }
  try {
    await bot.sendMessage(chatId, `Your verification code is: ${code}. It is valid for 5 minutes.`);
  } catch (error) {
    console.error('Error sending telegram message', error);
  }
};

export default bot;
