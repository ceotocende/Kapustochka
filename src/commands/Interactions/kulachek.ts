import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { client } from "../..";
import { colors, embedErrFromInteractions } from '../../utils/config';
import { kulachek } from '../../utils/gif.json'

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('кулачек')
        .setDescription('дать кулак')
        .addUserOption(option => option
            .setName('юзер')
            .setDescription('выберите пользователя')
            .setRequired(true))
        .addStringOption(option => option
            .setName('контент')
            .setDescription('введите контент сообщения')
            .setRequired(false)),
    run(client, interaction) {
        const content = interaction.options.getString('контент');
        let textContent = '';
        if (content) {
            textContent = ('> **' + content + '**');;
        }
        const gif = kulachek[Math.floor(Math.random() * kulachek.length)];
        const user = interaction.user;
        const target = interaction.options.getUser('юзер');
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Команда: кулачек' })
            .setDescription(`${user}, дал кулачек ${target}\n\n${textContent}`)
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