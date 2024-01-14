import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../..";
import { Marry } from "../../database/models/Marry";
import { colors, embedErrFromUserDb } from "../../utils/config";
import { Raiting } from "../../database/models/Raiting";
import { Users } from "../../database/models/Users";
import calculateLvl from "../../functions/calculateLvl";
import { emoji } from "../../utils/servIds.json";
import formatTimeForProfile from "../../functions/formatTimeForProfile";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('профиль')
        .setDescription('Посмотреть свой или профиль участника')
        .addUserOption(op => op
            .setName('user')
            .setDescription('Выбрать участника')
            .setRequired(false)),
    async run(client, interaction) {
        const targetUser = interaction.options.getUser('user') ?? interaction.user;

        const userDbMarry = await Marry.findOne({ where: { user_id_first: targetUser.id } }) ?? await Marry.findOne({ where: { user_id_second: targetUser.id } });
        const userRating = await Raiting.findOne({ where: { user_id: targetUser.id } });
        const userDb = await Users.findOne({ where: { user_id: targetUser.id } });

        let text = '';

        let userId = '';

        if (!userDbMarry) {
            text = 'Участник не состоит в отношениях'
        }

        if (userDbMarry?.user_id_first === targetUser.id) {
            userId = userDbMarry.user_id_second;
        } else if (userDbMarry?.user_id_second === targetUser.id) {
            userId = userDbMarry.user_id_first;
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Профиль участника: ${targetUser.username}` })
                    .setFields(
                        {
                            name: `Отношения`,
                            value: `${text === '' ? `Участник состоит в отношениях с <@${userId}>\nОтношения продолжаются уже \`${formatTimeForProfile(Date.now() - userDbMarry!.time)}\`` : text}`
                        },
                        {
                            name: `Общее время в голсовых каналх`,
                            value: `\`${formatTimeForProfile(userRating?.voice_time ?? 0)}\``
                        },
                        {
                            name: `Всего сообщений`,
                            value: `**${(userRating?.message ?? 0).toLocaleString('ru-RU')}**`
                        },
                        {
                            name: `Баланс`,
                            value: `**${(userDb?.balance ?? 0).toLocaleString('ru-RU')}**${emoji.serverCurrency}`
                        },
                        {
                            name: `Ранг и опыт`,
                            value: `Ранг: \n**${userDb?.rank ?? 0}**\nОпыт: \n**${(userDb?.exp ?? 0).toLocaleString('ru-RU')}** EXP из **${(calculateLvl(userDb?.rank ?? 0)).toLocaleString('ru-RU')}** EXP`
                        }
                    )
                    .setColor(`#${colors.stable}`)
                    .setThumbnail(targetUser.avatarURL())
            ]
        })
    },
})