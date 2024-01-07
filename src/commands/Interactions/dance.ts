import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { client } from "../..";
import { colors, embedErrFromInteractions } from '../../utils/config';
import { dance } from '../../utils/gif.json'

export default new client.command({
    structure: new SlashCommandBuilder()
    .setName('потанцевать')
        .setDescription('потанцевать')
        .addUserOption(option => option
            .setName('юзер')
            .setDescription('выберите пользователя')
            .setRequired(false))
        .addStringOption(option => option
            .setName('контент')
            .setDescription('введите контент сообщения')
            .setRequired(false)),
    run(client, interaction) {
        const target = interaction.options.getUser('юзер');

        const content = interaction.options.getString('контент');
 
        let textContent = '';
        if (content) {
            textContent = ('> **' + content + '**');;
        }
        const gif = dance[Math.floor(Math.random() * dance.length)];
        const user = interaction.user;

        if (!target) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: 'Команда: потанцевать' })
                        .setDescription(`${user} танцует\n\n${textContent}`)
                        .setImage(gif)
                        .setTimestamp()
                        .setColor(`#${colors.stable}`)
                        .setFooter({ iconURL: `${user.displayAvatarURL()}`, text: `${user.username}` })
                ]
            })
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Команда: потанцевать' })
            .setDescription(`${user}, танцует с ${target}\n\n${textContent}`)
            .setImage(gif)
            .setTimestamp()
            .setFooter({ iconURL: `${user.displayAvatarURL()}`, text: `${user.username}` })
            .setColor(`#${colors.stable}`)
        if (target?.bot === false && user.id != target?.id) {
            setTimeout(() => {
                interaction.reply({
                    embeds: [embed],
                }).then((msg) => {
                setTimeout(() => {
                    interaction.editReply({
                        content: ` `,
                        embeds: [embed]
                    });
                }, 10)
            })
            }, 100)
        } else if (target?.bot === true || user.id === target?.id) {
            interaction.reply({
                embeds: [embedErrFromInteractions]
            });
        }
    },
})