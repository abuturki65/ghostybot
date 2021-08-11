import { bold, inlineCode, time } from "@discordjs/builders";
import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";
import badges from "assets/ts/badges";

export default class UserInfoCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "info",
      name: "user",
      description: "Get information about a user",
      options: [
        {
          description: "The user you want more information about",
          name: "user",
          required: false,
          type: "USER",
        },
      ],
    });
  }

  async validate(): Promise<ValidateReturn> {
    return { ok: true };
  }

  async execute(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ) {
    const user = interaction.options.getUser("user") ?? interaction.user;

    const member = await this.bot.utils.findMember(interaction, [user.id], { allowAuthor: true });
    if (!member) {
      return interaction.reply({ ephemeral: true, content: lang.MEMBER.NOT_FOUND });
    }

    const { username, id, tag } = member.user;
    const joinedAt = member.joinedAt ? time(new Date(member.joinedAt), "F") : lang.UTIL.UNKNOWN;

    const nickname = member.nickname || lang.GLOBAL.NONE;

    const userFlags =
      (await member.user.fetchFlags(true))
        .toArray()
        .map((flag) => badges[flag])
        .join(" ") || lang.GLOBAL.NONE;

    const roles =
      member.roles.cache
        .filter((r) => r.id !== interaction.guildId)
        .sort((a, b) => b.rawPosition - a.rawPosition)
        .map((r) => r)
        .join(", ") || lang.GLOBAL.NONE;

    const roleCount = member.roles.cache.filter((r) => r.id !== interaction.guildId).size;

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setTitle(lang.UTIL.USER_INFO.replace("{username}", username))
      .setDescription(
        `
${bold("ID")}: ${inlineCode(id)}
${bold(lang.MEMBER.TAG)}: ${tag}
${bold(lang.MEMBER.BADGES)}: ${userFlags}
${bold(lang.MEMBER.CREATED_ON)}: ${time(new Date(member.user.createdAt), "F")}
`,
      )

      .addField(
        lang.UTIL.GUILD_INFO,
        `
${bold(lang.MEMBER.NICKNAME)}: ${nickname}
${bold(lang.MEMBER.JOINED_AT)}: ${joinedAt}
`,
      )
      .addField(bold(`${lang.MEMBER.ROLES} (${roleCount})`), roles)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed] });
  }
}