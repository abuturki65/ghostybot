const fetch = require("node-fetch");
const BaseEmbed = require("../../modules/BaseEmbed");

module.exports = {
  name: "anal",
  description: "anal nsfw",
  category: "nsfw",
  nsfwOnly: true,
  async execute(bot, message) {
    const data = await fetch(
      "https://nekobot.xyz/api/image?type=anal"
    ).then((res) => res.json());

    const embed = BaseEmbed(message)
      .setDescription(
        `[Click here if the image failed to load.](${data.message})`
      )
      .setImage(`${data.message}`);

    message.channel.send(embed);
  },
};
