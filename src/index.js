const { Telegraf } = require("telegraf");

const status = require("./light");
const moment = require("moment-timezone");

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let m_id = "";
let textEl = "";

bot.start(async (ctx) => {
  try {
    const chatId = ctx.chat.id;
    const clock = moment().tz("Europe/Kiev").format().slice(11, 16);

    const onlight = async () => {
      const resStatus = await status();
      return resStatus.status === "ok"
        ? "🟢 Є світло на даний момент: "
        : "🔴 Світла немає, на даний момент: ";
    };
    const { message_id, text } = await bot.telegram.sendMessage(
      chatId,
      `${await onlight()} ${clock}`
    );
    m_id = message_id;
    textEl = text.slice(0, 2);

    setInterval(async () => {
      const clock = moment().tz("Europe/Kiev").format().slice(11, 16);
      const newStatusLight = await onlight();

      if (textEl.slice(0, 2) === newStatusLight.slice(0, 2)) {
        await bot.telegram.editMessageText(
          chatId,
          m_id,
          0,
          `${await onlight()} ${clock}`
        );
        return;
      }

      const { message_id, text } = await bot.telegram.sendMessage(
        chatId,
        `${await onlight()} ${clock}`
      );
      m_id = message_id;
      textEl = text.slice(0, 2);
    }, 60000);
  } catch (error) {
    console.error(error);
  }
});

bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
