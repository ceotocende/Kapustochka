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
        description: `Привет, ${member.user} <:80_:1187223188208361692>
        <:88_:1187223116942934076> Навигация: <:88_:1187223116942934076>
        
        <:60_:1187222962542235659> Ознакомьтесь с правилами сервера ⁠✨смертные-грехи <:60_:1187222962542235659>
        
        <:131_:1156931257763115100> ⁠🔮задания - Задания и розыгрыши
        <:131_:1156931257763115100> ⁠✨новости - новости сервера
        <:131_:1156931257763115100> ⁠✨магазин - Бронь на турнир и премиум подписка сервера
        <:131_:1156931257763115100> ⁠🔮донаты-поддержка - Поддержка фонда на турнир и сервер
        <:131_:1156931257763115100> ⁠🐞команды-ботов - Список команд и использование ботов
        <:131_:1156931257763115100> ⁠🦔ищу-тиммейта - Поиск союзников
        
        <:131_:1156931257763115100> ⁠🪐событие - подробная информация каждого события
        <:131_:1156931257763115100> ⁠📍заявки-турнир - заявки на турнир
        <:131_:1156931257763115100> ⁠форум - Форум с публикациями
        <:131_:1156931257763115100> ⁠🪐анонсы - Игровые новости, обновления, сливы
        
        
        <:131_:1156931257763115100> ⁠🦔общее - общий чат
        <:131_:1156931257763115100> ⁠📋заявки - набор модерации
        <:131_:1156931257763115100> ⁠🐞экономика - Получение серверной валюты`,
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