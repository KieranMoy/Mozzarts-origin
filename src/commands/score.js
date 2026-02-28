import { SlashCommandBuilder } from "discord.js";
import { getUserPoints, getUserAllTimePoints } from "../helpers/scoreStore.js";

export default {
  data: new SlashCommandBuilder()
    .setName("score")
    .setDescription("Shows a player's current score")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Select a user (optional)")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
    }

    const guildId = interaction.guild.id;
    const targetUser =
      interaction.options.getUser("user") || interaction.user;

    const score = getUserPoints(guildId, targetUser.id);
    const allTimeScore = getUserAllTimePoints(guildId, targetUser.id);

    await interaction.reply({
      content: `${targetUser.username}'s scores:\nCurrent score: ${score}\nLifetime score: ${allTimeScore}`,
      ephemeral: true,
    });
  },
};