import { EmbedBuilder } from "discord.js"

export const colors = {
    stable: '2b2d31'
}

export const embedErrFromInteractions = new EmbedBuilder()
    .setTitle('Ошибка')
    .setDescription(`Произошла ошибка при выполнении команды.\nВы упомянули себя или бота, зачем вам это?`)
    .setImage('https://media.tenor.com/qkPV6_DL-NAAAAAd/bocchi-the-rock-bocchi.gif')
    .setColor('DarkRed');

export const embedErrFromUserDb = new EmbedBuilder()
    .setAuthor({ name: `Ошибка` })
    .setDescription('К сожалению вас или участника нет в базе данных.\nНапишите что нибудь в любой чат и я вас обязательно добавлю!')
    .setColor('Red')
    .setTimestamp()

export const emoji = {
    money: `<:money:1143261834749689906>`
}

export const photoServer = {
    serverAvatar: "https://media.discordapp.net/attachments/1189930336847659018/1189930640787902606/1640701208_27-papik-pro-p-luna-anime-risunok-28.jpg?ex=659ff444&is=658d7f44&hm=230e0931ebbec14f2419c3b255eba1657c100a490965204010e14071304b75b0&=&format=webp&width=1074&height=671",
}