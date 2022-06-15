import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

config({ path: '.dev.env' });
config();

type PossibleTextMessage = Message & { text?: string, reply_to_message?: PossibleTextMessage };

const BOT_SUPPORT_TOKEN = process.argv[2] || process.env.BOT_SUPPORT_TOKEN;
const BOT_SUPPORT_CHAT_ID = Number(process.argv[3] || process.env.BOT_SUPPORT_CHAT_ID);

if (!BOT_SUPPORT_TOKEN) {
    throw new Error(`Bot token is required and must be provided via environment variable BOT_SUPPORT_TOKEN or as first command line argument`)
}

if (!BOT_SUPPORT_CHAT_ID) {
    throw new Error(`Support chat id is required and must be provided via environment variable BOT_SUPPORT_CHAT_ID or as second command line argument`)
}

enum Strings {
    start = 'Hello! This is a support bot for RideNow Taxi services. Ask your question or describe application bug here.',
    thanks = 'Thanks for your feedback! We will answer as soon as possible.',
    Notified = 'The message is delivered to the client',
}

function fill(text: unknown, length: number) {
    const repeat = Math.max(length - String(text).length, 0);
    return text + " ".repeat(repeat);
}

const bot = new Telegraf(BOT_SUPPORT_TOKEN);

bot.start((ctx) => ctx.reply(Strings.start));

bot.on('message', async ctx => {
    const log = (...message: unknown[]) => console.log(`user ${fill(ctx.message.from.id, 10)} | chat ${fill(`${ctx.chat.id} (${ctx.chat.type})`, 27)} |`, ...message);
    try {
        log(`New incoming message.`);

        const message = ctx.message as PossibleTextMessage;

        if (ctx.chat.type === 'private' && message.text) {
            log(`Recognized question in private chat with text: "${message.text}".`);
            if (!message.from) {
                return;
            }
            const { first_name, last_name, id, username, language_code } = message.from;
            const questionText = `${id}. User ${first_name} ${last_name} (${username || 'no username'}, lang ${language_code}) left a question.\n\n${message.text}`;
            await bot.telegram.sendMessage(BOT_SUPPORT_CHAT_ID, questionText);
            log(`Question was succesfully forwarded to support chat.`);
            await bot.telegram.sendMessage(message.from.id, Strings.thanks)
            log(`The client is notified that the question is delivered to support.`);
        } else if (ctx.message.chat.id === BOT_SUPPORT_CHAT_ID) {
            log(`Recognized reply in support chat.`);
            const questionMessage = message.reply_to_message;
            const isReplyToBot = questionMessage?.from?.id === ctx.botInfo.id;
            if (!isReplyToBot) {
                log(`Recognized reply is not connected to the bot messages.`);
                return;
            }
            const clientId = questionMessage.text?.split('.')?.[0];
            if (!clientId || isNaN(Number(clientId))) {
                throw new Error(`The problem occured while parsing client id from message. Parsed id: ${clientId}.`);
            }
            const { first_name } = ctx.message.from; // TODO: Change with ref. to const message
            const text = `${message.text}\n\n${first_name}, RideNow Taxi Support`;
            await ctx.telegram.sendMessage(clientId, text);
            log(`${first_name} has answered to client's (id: ${clientId}) question with text: ${message.text}.`);
            await ctx.telegram.sendMessage(BOT_SUPPORT_CHAT_ID, Strings.Notified);  // TODO: Change with ref. to const message
            log(`Support is notified that the answer was delivered to client`);
        } else {
            console.log(`The message text is empty or such type of the message has no specific handler. Message is ignored.`);
        }
    } catch (e) {
        console.log('An error occured', e instanceof Error ? e.message : e);
    }
});

bot.launch().then(() => console.log('Bot is started.'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
