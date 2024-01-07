import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import { addBalance } from "../database/functions/addBalance";
import { Users } from "../database/models/Users";
import { colors } from "../utils/config";
import calculateLvl from "./calculateLvl";
import { channelId } from '../utils/servIds.json';

// Пока что логи в тестовый чат

export default async function chekRank(id: string, guild: Guild) {
    const user = await Users.findOne({ where: { user_id: id } });

    const channelCommand = guild.channels.cache.get(channelId.serverLogs) as TextChannel;

    if (!user) {
        await addBalance(id, 1);
    } else if (user.user_id === id) {
        if (user.exp > calculateLvl(user.rank)) {
            await channelCommand.send({
                // content: `||<@${id}>||`,
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Вы повысили уровень')
                        .setDescription(`Поздравляю <@${id}>, Вы повысили свой уровень.\nТеперь вы \`${user.rank + 1}\` уровня!`)
                        .setColor(`#${colors.stable}`)
                        .setTimestamp()
                ]
            })
            user.rank = Number(user.rank) + 1;
            user.exp = 0;
            user.save();
        }
    } 
}