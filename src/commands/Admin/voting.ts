import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { client } from "../..";
import { Voting } from "../../database/models/Voting";
import { colors, photoServer } from "../../utils/config";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('add_voting')
        .setDescription('Добавить голосование на сервер.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(op => op
            .setName('channel')
            .setDescription('Выбрать канал')
            .setRequired(true))
        .addStringOption(op => op
            .setName('name')
            .setDescription('Название голосования')
            .setMaxLength(50)
            .setRequired(true))
        .addStringOption(op => op
            .setName('text')
            .setDescription('Описание голосования')
            .setRequired(true)),
    async run(client, interaction) {
        const votingChannel = interaction.options.getChannel('channel') as TextChannel;
        const nameVoting = interaction.options.getString('name');
        const textVoting = interaction.options.getString('text');

        if (!votingChannel) {
            interaction.reply({
                content: `Вы неправильно указали канал`,
                ephemeral: true
            })
        } else {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${nameVoting}`, iconURL: `${photoServer.serverAvatar}` })
                .setDescription(`${textVoting}`)
                .setColor(`#${colors.stable}`)
                .setThumbnail(`${photoServer.serverAvatar}`)
                .setTimestamp()

            interaction.reply({
                content: `Вы отправили сообщение в канал ${votingChannel}`,
                ephemeral: true
            })

            const sentMes = await votingChannel.send({
                embeds: [embed]
            })

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`Voting-Yes-${sentMes.id}`)
                    .setLabel('За')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`Voting-No-${sentMes.id}`)
                    .setLabel('Против')
                    .setStyle(ButtonStyle.Danger)
            )

            sentMes.edit({
                components: [row]
            })

            const newVoting = await Voting.create({ voting_id: sentMes.id, channel_id: votingChannel.id, voting_yes: 0, voting_no: 0, voting_name: nameVoting! })
        }
    },
})