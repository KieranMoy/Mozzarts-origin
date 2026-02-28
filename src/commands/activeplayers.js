import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getSession } from "../gameState.js";
import { getGuildScoresSorted } from "../helpers/scoreStore.js";

export default {
  data: new SlashCommandBuilder()
    .setName("activeplayers")
    .setDescription("Displays ranked players in the current trivia session."),

  async execute(interaction) {
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
    }

    const session = getSession(guild.id);

    if (!session || !session.active) {
      return interaction.reply({
        content: "ℹ️ No active trivia session in this server.",
        ephemeral: true,
      });
    }

    const scores = getGuildScoresSorted(guild.id);

    if (!scores.length) {
      return interaction.reply({
        content: "No players have scored points yet.",
      });
    }

    const ranked = scores
      .map(([userId, points], index) => {
        return `${index + 1}. <@${userId}> — **${points}**`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🏆 Active Player Rankings")
      .setDescription(ranked);

    await interaction.reply({ embeds: [embed] });
  },
};