import { Message } from "discord.js";

export default function messageReact(message: Message) {
    if (message.content === 'бу') {
        let text = ['ты че пес пугаешь', 'зашибу', 'бот умер от инсульта', 'бубубу', 'я не зеркало чтоб меня пугать', 'я тебя переебу', 'бука', 'X_X']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'а че') {
        let text = ['а ниче', 'через плечо']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'не знаю') {
        let text = ['а кто знает?', 'как так-то', 'а надо знать', 'а я знаю хехе', 'почему', 'я всее знаю', 'продам инфу за 50р']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'хочу') {
        let text = ['я тоже(', 'перехочешь', 'зачем']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'зачем') {
        let text = ['Няда']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'ало') {
        let text = ['хуем по лбу не дало', 'кто звонит', 'алоха']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'каналы') {
        let text = [`Привет 💜 
        Не забудь заглянуть на наши каналы:
        
        https://www.twitch.tv/floomberm - twitch
        https://t.me/japchelkaM - telegram
        https://www.instagram.com/floomber_exeter/ - instagram
        `]
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'привет') {
        let text = ['приветики-пистолетики', 'даров', 'и тебе привет)', 'прувет', 'приветик', 'хаюшки', 'приветули', 'даров заебал', 'добрый день(или вечер)', 'Здравствуйте!', 'как делишки']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'всем привет') {
        let text = ['и тебе привет', 'как дела', 'Приветствую ', 'ОО братан', 'Привет от ботяры', 'Переветик']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'хочу денег') {
        let text = [`Можешь заработать в чате #🐞экономика:
        2. В канале закреплены команды бота 
        
        Что мне дают серверные деньги? - Получение кастомной роли, доступ к NSFW, звуковой панели, покупка банера и значков, общий банк сервера. Подробнее в канале #подписка`]
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'как дела?') {
        let text = ['а мне нормааально', 'хочу кушать']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    } else if (message.content.toLocaleLowerCase() === 'как дела') {
        let text = ['а мне нормааально', 'хочу кушать']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
} else if (message.content.toLocaleLowerCase() === 'что делаешь') {
        let text = ['сплю', 'нагоняю суеты', 'в карты играю', 'играю в кто круче овощ', 'играю в лигу', 'готовлю хачапурьки', 'глажу котика', 'тебя обнимаю<3', 'считаю здвёзды... О тебя нашел']
        const randomText = text[Math.floor(Math.random() * text.length)];
        message.reply(randomText)
    }
}