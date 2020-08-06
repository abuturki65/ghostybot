const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../utils/functions");

module.exports = {
  name: "channelUpdate",
  async execute(bot, oldChannel, newChannel) {
    const auditChannel = await getAuditChannel(oldChannel.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (
      !oldChannel.guild.channels.cache.some(
        (ch) => ch.name === auditChannel.name
      )
    )
      return;

    let msg = "";

    if (oldChannel.name !== newChannel.name) {
      msg = `Channel **${oldChannel.name}** was renamed to ${newChannel}`;
    } else if (oldChannel.topic !== newChannel.topic) {
      msg = `Channel topic in channel ${newChannel} was updated from \`${oldChannel.topic}\` to \`${newChannel.topic}\``;
    } else {
      msg = `${newChannel} was updated`;
    }

    const embed = new MessageEmbed()
      .setTitle("Channel Updated")
      .setDescription(msg)
      .setColor("ORANGE")
      .setTimestamp();

    bot.channels.cache.get(auditChannel.id).send({ embed });
  },
};
