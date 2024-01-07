import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { client } from "../..";
import { Voting } from "../../database/models/Voting";
import { colors, photoServer } from "../../utils/config";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('end_voting')
        .setDescription('Закончить голосование на сервере.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(op => op
            .setName('id')
            .setDescription('Укажите id сообщения !ОБЯЗАТЕЛЬНО!')
            .setRequired(true)),
    async run(client, interaction) {
        const textVoting = interaction.options.getString('id');
        const votingDb = await Voting.findOne({ where: { voting_id: textVoting! } })
        
        if (!votingDb) {
            interaction.reply({
                content: `Вы неправильно указали id сообщения или его нет в базе данных`,
                ephemeral: true
            })
        } else {
            const channel = await interaction.guild?.channels.fetch(`${votingDb.channel_id}`) as TextChannel;
            const buttonLable = await channel.messages.fetch(`${votingDb.voting_id}`);
           
            buttonLable?.edit({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `${votingDb.voting_name}`, iconURL: `${photoServer.serverAvatar}` })
                        .setDescription(`Голосование оконченно`)
                        .setFields(
                            {
                                name: `Проголосовало **ЗА**`,
                                value: `${votingDb.voting_yes}`,
                                inline: true
                            },
                            {
                                name: `Проголосовало **ПРОТИВ**`,
                                value: `${votingDb.voting_no}`,
                                inline: true
                            }
                        )
                        .setColor(`#${colors.stable}`)
                        .setThumbnail(`${photoServer.serverAvatar}`)
                        .setTimestamp()
                ],
                components: []
            })

            interaction.reply({
                ephemeral: true,
                content: `Голосование отключено. Номер голосования \`${textVoting}\``
            })

            const destroyVoting = await Voting.destroy({ where: { voting_id: textVoting! } }).catch(err => console.error(err));
        }
    },
})