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
    money: `<:12:1196401905337901126>`
}

export const photoServer = {
    serverAvatar: "https://images-ext-1.discordapp.net/external/y87jxbCRGhp5yxvoGMCorKm6gOrKIH5b-BgS1_hS47w/https/cdn.discordapp.com/icons/743526389634039810/a_c5b157a07d0c057f4dcf7ee73ebbd0af.gif"
}

export const rewards = {
    timely: 100,
    daily: 1000,
    weekly: 5000,
    monthly: 10000,
    work: Math.floor(Math.random() * (10000 - 100 + 1)) + 100
}

export const rewardsTiming = {
    timely: 12 * 60 * 60 * 1000,
    daily: 24 * 60 * 60 * 1000,
    weekly: 168 * 60 * 60 * 1000,
    monthly: 30 * 24 * 60 * 60 * 1000,
    work: 4 * 60 * 60 * 1000
}

export const workName = [
    'учителя',
    'заправщика',
    'музканта',
    'редактора',
    'экономиста',
    'водителя',
    'эколога',
    'инженера',
    'мененджера',
    'кассира',
    'психолога',
    'работник склада',
    'курьера',
    'администратора',
    'журналиста'
]