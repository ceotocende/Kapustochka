import { Message, PermissionFlagsBits, SlashCommandBuilder, TextChannel, channelLink } from "discord.js";
import { client } from "../..";

export default new client.command({
    structure: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Очистить сообщения')
    .addNumberOption(op => op
        .setName('amount')
        .setDescription('Укажите сколько нажо очистить (от 1 до 100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async run(client, interaction) {
        const amount = interaction.options.getNumber('amount');
        const channel = interaction.channel as TextChannel;

        if (isNaN(amount!) || !amount) {
            interaction.reply({
                content: `Произошла ошибка, обратитесь к разработчику`,
                ephemeral: true
            });
            return;
        } 
       
        const messages = await channel.messages.fetch({
            limit: amount + 1
        })

        let i = 0;
        const filtered: Array<Message> = [];

        messages!.filter((msg) => {
            if (amount > i) {
                filtered.push(msg);
                i++
            }
        })

        await channel.bulkDelete(filtered).then(messages => {
            interaction.reply({
                content: `Удаленно успено ${amount} сообщений`,
                ephemeral: true
            })
        })
        
    },
})