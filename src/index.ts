import Discord, { Message, TextChannel, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from './config/secrets';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ChannelType } from 'discord.js';

const client = new Discord.Client({ intents: [GatewayIntentBits.GuildMessages] });

client.on("ready", async () => {
  console.log("Starting");
  // No reason why we need to make this request but bot doesnt work otherwise
  const channelCheck = await client.channels.fetch("1048639746794082357") as TextChannel;
});

client.on("error", e => { console.error("Discord client error!", e); });

client.login(DISCORD_TOKEN);

const buttons = [
  ["Update project info", "update"],
  ["Report TVL error", "data-error"],
  ["Report APY error", "apy-error"],
  ["API issue", "api"],
  ["Other", "other"],
] as [string, string][]
const rows = buttons.map(([label, id]) => new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId(id)
      .setLabel(label)
      .setStyle(ButtonStyle.Primary),
  )
);

client.on("messageCreate", async (message: Message) => {
  if (message.content !== "<@1048644295646793788> gib") return
  await message.channel.send({ content: 'If you have a question you can create a ticket using the buttons below.', components: rows });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;
  const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
  const thread = await channel.threads.create({
    name: `${interaction.customId} ${interaction.user.username}`,
    autoArchiveDuration: 60,
    type: ChannelType.PrivateThread,
    reason: 'Pls gib info',
  });
  await thread.members.add(interaction.user.id);
  await interaction.reply({ content: 'Thread created', ephemeral: true })
});