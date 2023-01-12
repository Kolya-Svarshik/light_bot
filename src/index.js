const { Telegraf } = require("telegraf");

const status = require("./light");

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  try {
    const chatId = ctx.chat.id;
    const resStatus = await status().then(({ status }) => status);
    const date = new Date();
    const clock = date.toString().slice(16, 21);

    const onlight =
      resStatus === "ok"
        ? "🟢 Є світло на даний момент: "
        : "🔴 Світла немає, на даний момент: ";

    const { message_id } = await bot.telegram.sendMessage(
      chatId,
      `${onlight} ${clock}`
    );
    setInterval(async () => {
      const date = new Date();
      const clock = date.toString().slice(16, 21);

      await bot.telegram.editMessageText(
        chatId,
        message_id,
        0,
        `${onlight} ${clock}`
      );
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
