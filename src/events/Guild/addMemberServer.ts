import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../..";
import { Users } from "../../database/models/Users";
import { sayHi } from '../../utils/gif.json';
import { colors } from "../../utils/config";
import { channelId } from "../../utils/servIds.json";

client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;

    const id = member.id;

    const user = await Users.findOne({ where: { user_id: id } });

    user ? 0 : Users.create({ user_id: id, balance: 0, bank: 0, exp: 0, rank: 0, cookie: 0 });

    const gif = sayHi[Math.floor(Math.random() * sayHi.length)];

    const embed = new EmbedBuilder({
        author: {
            name: `Приветствуем тебя на сервере ${member.user.username}`,
            iconURL: `${member.displayAvatarURL()}`
        },
        description: `Привет ${member}, рады твоему успешному призмелению на ${member.guild.name}.\nПрошу распалагайся и чуствуй себя как дома!`,
        thumbnail: {url: `${member.guild.iconURL()}`},
        image: {url: `${gif}`}
    })
    .setColor(`#${colors.stable}`)

    const channel = member.client.channels.cache.get(channelId.chat) as TextChannel;
    
    channel.send({
        content: `||${member.user}||`,
        embeds: [embed]
    })

    const logChannel = member.client.channels.cache.get(channelId.serverLogs) as TextChannel;

    logChannel.send({
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Новый пользователь ${member.user.username}`, iconURL: `${member.displayAvatarURL()}` })
                .setDescription(`
                В дискорде ${new Date(member.user.createdAt)}
                `)
                .setTimestamp()
                .setFooter({ text: `${member.id}` })
        ]
    })
})