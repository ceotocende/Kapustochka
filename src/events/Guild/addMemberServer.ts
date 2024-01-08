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
            iconURL: `${member.displayAvatarURL()}`,
            url: `https://www.twitch.tv/floomberm`
        },
        description: `Привет, ${member.user} <:80_:1187223188208361692>\n<:88_:1187223116942934076> Навигация: <:88_:1187223116942934076>\n\n<:60_:1187222962542235659> Ознакомьтесь с правилами сервера <#807646859790778398> <:60_:1187222962542235659>\n\n<:131_:1156931257763115100> ⁠<#1163166491114479706> - Задания и розыгрыши\n<:131_:1156931257763115100> <#1154946605573746788> - новости сервера\n<:131_:1156931257763115100> <#1144931972045611029> - Бронь на турнир и премиум подписка сервера\n<:131_:1156931257763115100> ⁠<#1143301332191686766> - Поддержка фонда на турнир и сервер\n<:131_:1156931257763115100> ⁠<#808722001375002634> - Список команд и использование ботов\n<:131_:1156931257763115100> ⁠<#1143140432306520104> - Поиск союзников\n\n<:131_:1156931257763115100> ⁠<#1135307913796259972> - подробная информация каждого события\n<:131_:1156931257763115100> ⁠<#1141397477984047215> - заявки на турнир\n<:131_:1156931257763115100> <#1141333948190949407> - Форум с публикациями\n<:131_:1156931257763115100> ⁠<#1142462910887628800> - Игровые новости, обновления, сливы\n\n<:131_:1156931257763115100> ⁠<#1173459738277724181> - общий чат\n<:131_:1156931257763115100> ⁠1144263261546614824 - набор модерации\n<:131_:1156931257763115100> ⁠<#1147261633060679731> - Получение серверной валюты`,
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