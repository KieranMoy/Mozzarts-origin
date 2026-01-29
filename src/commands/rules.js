import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import rules from "../config/rules.json" assert { type: "json" };

// ... inside execute(interaction) ...
const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Trivia Game Rules")
    .setDescription(rules.intro)
    .addFields(
        { name: 'Difficulties', value: rules.difficulties.join('\n'), inline: true },
        { name: 'How to Play', value: rules.gameplay.map(g => `• ${g}`).join('\n') }
    )
    .setFooter({ text: 'Good luck, maestro!' });
//Ephemeral allows for the user that requested the rules to see it
await interaction.reply({ embeds: [embed], ephemeral: true });