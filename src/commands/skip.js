import {
  SlashCommandBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  MessageFlags,
} from "discord.js";

import { getSession, skipCurrentRound, setSession } from "../gameState.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Admin only: skip the current trivia round."),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: "Guild only.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const member = interaction.member;
    const isAdmin =
      member?.permissions?.has?.(PermissionsBitField.Flags.Administrator) ?? false;

    if (!isAdmin) {
      return interaction.reply({
        content: "You must be a server administrator to use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const guildId = interaction.guild.id;
    const session = getSession(guildId);

    if (!session || !session.active) {
      return interaction.reply({
        content: "No active trivia round to skip.",
        flags: MessageFlags.Ephemeral,
      });
    }

    skipCurrentRound(guildId);
    const updatedSession = getSession(guildId);

    try {
      if (updatedSession?.timerInterval) {
        clearInterval(updatedSession.timerInterval);
      }
    } catch {}

    try {
      if (updatedSession?.previewStopper) {
        clearTimeout(updatedSession.previewStopper);
      }
    } catch {}

    try {
      updatedSession?.player?.stop(true);
    } catch {}

    try {
      if (updatedSession?.roundCollector && !updatedSession.roundCollector.ended) {
        updatedSession.roundCollector.stop("skipped");
      }
    } catch {}

    try {
      if (updatedSession?.textChannelId && updatedSession?.roundMessageId) {
        const ch = await interaction.guild.channels.fetch(updatedSession.textChannelId).catch(() => null);
        if (ch?.isTextBased?.()) {
          const msg = await ch.messages.fetch(updatedSession.roundMessageId).catch(() => null);
          if (msg?.components?.length) {
            const disabled = msg.components.map((row) => {
              const rb = ActionRowBuilder.from(row);
              rb.setComponents(row.components.map((c) => ButtonBuilder.from(c).setDisabled(true)));
              return rb;
            });
            await msg.edit({ components: disabled }).catch(() => {});
          }
        }
      }
    } catch {}

    try {
      if (updatedSession) {
        updatedSession.timerInterval = null;
        updatedSession.previewStopper = null;
        updatedSession.roundCollector = null;
        setSession(guildId, updatedSession);
      }
    } catch {}

    await interaction.reply({
      content: "⏭️ Current trivia round skipped.",
      flags: MessageFlags.Ephemeral,
    });

    if (updatedSession?.textChannelId) {
      const ch = await interaction.guild.channels.fetch(updatedSession.textChannelId).catch(() => null);
      if (ch?.isTextBased?.()) {
        await ch.send("⏭️ **Round skipped by administrator.**").catch(() => {});
      }
    }
  },
};
