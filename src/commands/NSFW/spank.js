const BaseEmbed = require("../../modules/BaseEmbed");

module.exports = {
  name: "spank",
  category: "nsfw",
  usage: "None",
  nsfwOnly: true,
  async execute(bot, message) {
    const data = await bot.neko.nsfw.spank();

    const blowjob = BaseEmbed(message)
      .setTitle("Spank")
      .setImage(data.url)
      .setURL(data.url);
    message.channel.send(blowjob);
  },
};
