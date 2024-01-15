import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../..";
import { Users } from "../../database/models/Users";
import { colors } from "../../utils/config";
import { channelId, roleId } from "../../utils/servIds.json";

client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;

    const id = member.id;

    const user = await Users.findOne({ where: { user_id: id } });

    user ? 0 : Users.create({ user_id: id, balance: 0, bank: 0, exp: 0, rank: 0, cookie: 0 });

    const embed = new EmbedBuilder({
        author: {
            name: `Приветствуем тебя на сервере ${member.user.username}`,
            iconURL: `${member.displayAvatarURL()}`,
            url: `https://www.twitch.tv/floomberm`
        },
        description:`**Привет**, ${member.user} <:80_:1187223188208361692>\n<:88_:1187223116942934076>  **Навигация:** <:88_:1187223116942934076>\n\n<:60_:1187222962542235659>  Ознакомьтесь с правилами сервера https://discord.com/channels/743526389634039810/807646859790778398 <:60_:1187222962542235659>\n\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1163166491114479706 - Задания и розыгрыши\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1154946605573746788 - новости сервера\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1144931972045611029 - Бронь на турнир и премиум подписка сервера\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1143301332191686766 - Поддержка фонда на турнир и сервер\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/808722001375002634 - Список команд и использование ботов\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1143140432306520104 - Поиск союзников\n\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1135307913796259972 - подробная информация каждого события\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1141397477984047215 - заявки на турнир\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1141333948190949407 - Форум с публикациями\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1142462910887628800 - Игровые новости, обновления, сливы\n\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/743526390153871362 - общий чат\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1144263261546614824 - набор модерации\n<:131_:1156931257763115100>  https://discord.com/channels/743526389634039810/1147261633060679731 - Получение серверной валюты` ,
        thumbnail: {url: `${member.guild.iconURL()}`},
        image: {url: `https://cdn.discordapp.com/attachments/1103172811666767925/1144360059678232738/08EF4796-C124-4E67-9D19-96F58A4B3B08.gif?ex=65a982db&is=65970ddb&hm=6787d902ebe8b23a5b4887c3eee4f8ff763924588a191660e5f1e73b5f9ec8a5&`}
    })
    .setColor(`#${colors.stable}`)

    const channel = member.client.channels.cache.get(channelId.chat) as TextChannel;
    
    channel.send({
        content: `${member.user} <@&${roleId.helper}>`,
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