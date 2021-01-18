import { Message, MessageAttachment, TextChannel } from "discord.js";
import fetch from "node-fetch";
import URL from "url";
import Command from "../../structures/Command";
import Bot from "../../structures/Bot";

const PORN_BLACKLIST_LIST_URL =
  "https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt";
const CAPTURE_URL = "https://image.thum.io/get/width/1920/crop/675/noanimate/";

export default class WebCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "web",
      description: "Returns a screenshot of the requested website",
      category: "util",
      aliases: ["screenshot"],
      requiredArgs: ["url"],
      usage: "<url EG: https://google.com >",
    });
  }

  async execute(bot: Bot, message: Message, args: string[]) {
    const lang = await bot.utils.getGuildLang(message.guild?.id);

    try {
      const url = args.join(" ");
      const sendMsg = await message.channel.send(lang.UTIL.PROCESSING_IMAGE);
      const isNsfw = await this.isNsfw(url);

      console.log(isNsfw);

      if (!url.startsWith("http")) {
        return message.channel.send(lang.UTIL.WEB_HTTP);
      }

      if (!(message.channel as TextChannel).nsfw && isNsfw) {
        sendMsg.deletable && sendMsg.delete();
        return message.channel.send(lang.UTIL.WEB_NSFW);
      }

      const result = `${CAPTURE_URL}${url}`;
      const attachment = new MessageAttachment(result, "capture.png");

      sendMsg.deletable && sendMsg.delete();

      message.channel.send(attachment);
    } catch (err) {
      bot.utils.sendErrorLog(err, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }

  async isNsfw(url: string) {
    const res = await fetch(PORN_BLACKLIST_LIST_URL).then((res) => res.text());

    const parsed = URL.parse(url);
    const list = [
      ...res
        .split("\n")
        .filter((s) => !s.startsWith("#"))
        .map((s) => s.replace("0.0.0.0", "")),
      "pornhub.com",
    ].join("\n");

    return list.includes(parsed.host!);
  }
}
