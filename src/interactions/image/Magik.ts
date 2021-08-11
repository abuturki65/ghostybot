import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import fetch from "node-fetch";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";

export default class MagikCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "image",
      name: "magik",
      description: "Just Magik.",
      options: [
        {
          name: "user",
          description: "A user",
          type: "USER",
          required: false,
        },
        {
          name: "intensity",
          description: "The intensity of the Magik",
          type: "NUMBER",
          required: false,
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
    await interaction.deferReply();

    const user = interaction.options.getUser("user") ?? interaction.user;
    const intensity = interaction.options.getNumber("intensity") ?? Math.floor(Math.random() * 10);

    const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=magik&intensity=${encodeURIComponent(
        intensity,
      )}&image=${user?.displayAvatarURL({
        format: "png",
      })}`,
    ).then((res) => res.json());

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.message})`)
      .setImage(data.message);

    await interaction.editReply({ embeds: [embed] });
  }
}