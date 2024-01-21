import { EmbedBuilder } from "discord.js";
import { Users } from "../models/Users";
import { colors } from "../../utils/config";
import { photoServer } from "../../utils/config";
import { Sequelize } from "sequelize";

export default async function generationPageForRaiting(page: number, maxMember: number) {
    const userDb = await Users.findAll({
        attributes: [
            'user_id',
            [Sequelize.fn('max', Sequelize.col('balance')), 'balance']
        ],
        group: ['user_id'],
        order: [[Sequelize.fn('max', Sequelize.col('balance')), 'DESC']]
    });
    const from = (page - 1) * maxMember;
    const to = page * maxMember;
    const pagesCount = Math.ceil(userDb.length / maxMember);

    const embed = new EmbedBuilder()
        .setTitle('Рейтинг')
        .setDescription(`Страница ${page} из ${pagesCount}`)
        .setColor(`#${colors.stable}`)
        .setTimestamp()
        .setThumbnail(`${photoServer.serverAvatar}`);

        userDb.slice(from, to).forEach((user, index) => {
        embed.addFields({
            name: `Место №${index + from + 1}.឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵            ឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵            ឵            ឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵឵            `,
            value: `<@${user.user_id}>\n**${user.balance}**`,
        });
    });
    embed.setFooter({ text: `Страница ${page} из ${pagesCount}` });
    return embed;
}