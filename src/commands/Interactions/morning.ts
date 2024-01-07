import { SlashCommandBuilder, EmbedBuilder, moveElementInArray } from "discord.js";
import { client } from "../..";
import { colors, embedErrFromInteractions } from '../../utils/config';
import { morning } from '../../utils/gif.json'

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('утро')
        .setDescription('Пожелать доборого утра')
        .addUserOption(option => option
            .setName('юзер')
            .setDescription('Выберите пользователя')
            .setRequired(true))
        .addStringOption(option => option
            .setName('контент')
            .setDescription('Введите контент сообщения')
            .setRequired(false)),
    run(client, interaction) {
        const content = interaction.options.getString('контент');
        let textContent = '';
        if (content) {
            textContent = ('> **' + content + '**');;
        }
        const gif = morning[Math.floor(Math.random() * morning.length)];
        const user = interaction.user;
        const target = interaction.options.getUser('юзер');
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Команда: доброе утро' })
            .setDescription(`${user}, пожелал(а) доброго утра ${target}\n\n${textContent}`)
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