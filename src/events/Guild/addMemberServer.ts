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
        description:`**Привет**, {{member}} :80_: 
        :88_:  **Навигация:** :88_: 
        
        :60_:  Ознакомьтесь с правилами сервера https://discord.com/channels/743526389634039810/807646859790778398 :60_:  
         
        :131_:  https://discord.com/channels/743526389634039810/1163166491114479706 - Задания и розыгрыши
        :131_:  https://discord.com/channels/743526389634039810/1154946605573746788 - новости сервера
        :131_:  https://discord.com/channels/743526389634039810/1144931972045611029 - Бронь на турнир и премиум подписка сервера
        :131_:  https://discord.com/channels/743526389634039810/1143301332191686766 - Поддержка фонда на турнир и сервер
        :131_:  https://discord.com/channels/743526389634039810/808722001375002634 - Список команд и использование ботов
        :131_:  https://discord.com/channels/743526389634039810/1143140432306520104 - Поиск союзников
        
        :131_:  https://discord.com/channels/743526389634039810/1135307913796259972 - подробная информация каждого события
        :131_:  https://discord.com/channels/743526389634039810/1141397477984047215 - заявки на турнир
        :131_:  https://discord.com/channels/743526389634039810/1141333948190949407 - Форум с публикациями
        :131_:  https://discord.com/channels/743526389634039810/1142462910887628800 - Игровые новости, обновления, сливы
        
        
        :131_:  https://discord.com/channels/743526389634039810/743526390153871362 - общий чат
        :131_:  https://discord.com/channels/743526389634039810/1144263261546614824 - набор модерации
        :131_:  https://discord.com/channels/743526389634039810/1147261633060679731 - Получение серверной валюты` ,
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