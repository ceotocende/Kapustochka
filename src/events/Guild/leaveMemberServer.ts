import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../..";
import { Users } from "../../database/models/Users";
import { sayHi } from '../../utils/gif.json';
import { colors } from "../../utils/config";
import { channelId } from '../../utils/servIds.json';
import { Marry } from "../../database/models/Marry";
import { Raiting } from "../../database/models/Raiting";

client.on('guildMemberRemove', async (member) => {
    if (member.user.bot) return;

    const id = member.id;

    const user = await Users.findOne({ where: { user_id: id } });
    const userRaiting = await Raiting.findOne({ where: { user_id: id } });

    !user ? 0 : Users.destroy({ where: { user_id: id }});
    !userRaiting ? 0 : Raiting.destroy({ where: { user_id: id }});

    const gif = sayHi[Math.floor(Math.random() * sayHi.length)];

    const embed = new EmbedBuilder({
        author: {
            name: `Участник ${member.user.username} вышел с сервера`,
            iconURL: `${member.displayAvatarURL()}`
        },
        description: `На сервере ${(member.joinedAt)}\nРоли: ${member.roles}`,
        thumbnail: {url: `${member.guild.iconURL()}`},
        image: {url: `${gif}`}
    })
    .setColor(`#${colors.stable}`)

    const channel = member.client.channels.cache.get(`${channelId.userLog}`) as TextChannel;

    channel.send({
        embeds: [embed]
    })
})