import {  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import { client } from "../..";
import { colors } from "../../utils/config";
import getFilesAndFolders from "../../functions/GetDataAboutFoldersAndFiles";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('хелп')
        .setDescription('Команда помощи'),
    async run(client, interaction) {

        await interaction.deferReply()

        const firstEmbed = new EmbedBuilder()
            .setTitle('Помощь')
            .setDescription('Выберите интересующий вас пункт')
            .setColor(`#${colors.stable}`)

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('selectMenuFromHelpCommand')
            .setPlaceholder('Выберите интересующий вас вариант')
            .setOptions(
                {
                    value: "Economy",
                    label: "Экономика"
                },
                {
                    value: "Interactions",
                    label: "Интерактивные команды"
                },
                {
                    value: "Other",
                    label: "Другие команды"
                },
                {
                    value: "Marry",
                    label: "Женитьба"
                }
            )

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)

        const message = await interaction.editReply({
            embeds: [firstEmbed],
            components: [row],
        })

        const rowButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('buttonFromHelpBackCommand')
                .setLabel('Back')
                .setEmoji('🔙')
                .setStyle(ButtonStyle.Secondary)
        )


        const collector = message.createMessageComponentCollector({ time: 30_000 })

        collector.on("collect", async (subInteraction: Interaction) => {
            if (subInteraction.isChatInputCommand()) return;
            if (subInteraction.isButton()) {
                if (subInteraction.customId === 'buttonFromHelpBackCommand') {
                    await subInteraction.deferUpdate();
                    message.edit({
                        embeds: [firstEmbed],
                        components: [row]
                    })
                }
            };
            if (subInteraction.isStringSelectMenu()) {
                const fileThisFolder = getFilesAndFolders(subInteraction.values[0]);

                const secondEmbed = new EmbedBuilder()
                    .setTitle('Список комманд')
                    .setColor(`#${colors.stable}`)

                let commandsArray: any;
                let str: string = "";

                if (fileThisFolder.length < 25) {
                    commandsArray = fileThisFolder.map(commandInfo => ({
                        name: `${commandInfo.name}`,
                        value: `${commandInfo.description}`,
                        inline: false
                    }))
                    secondEmbed.setFields(commandsArray)
                } else {
                    str += fileThisFolder.map(commandInfo => {
                        return `**${commandInfo.name}** \n${commandInfo.description}\n\n`
                    }).join('');
                    secondEmbed.setDescription(str);
                }

                await subInteraction.deferUpdate();

                message.edit({
                    embeds: [secondEmbed],
                    components: [rowButton]
                })

            }
        })
        collector.on("end", async (subInteraction: Interaction) => {
            message.edit({
                embeds: [
                    new EmbedBuilder({
                        title: "Помощь",
                        description: "Действие закрыто",
                    })
                        .setColor(`#${colors.stable}`)
                ],
                components: []
            })
        })
    },
}) 