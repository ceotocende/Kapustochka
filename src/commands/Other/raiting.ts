import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../..";
import { Users } from "../../database/models/Users";
import generationPageForRaiting from "../../database/functions/generationPageForRaiting";
import { colors } from "../../utils/config";

const maxUserList = 10;
let page: number = 1;

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('рейтинг')
        .setDescription('Открыть таблицу лидеров'),
    async run(client, interaction) {
        const allUserDb = await Users.findAll({});

        await interaction.deferReply();

        const buttonDown = new ButtonBuilder()
            .setCustomId('buttonDownForRaiting')
            .setEmoji('⏪')
            .setLabel('Назад')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const buttonNext = new ButtonBuilder()
            .setCustomId('buttonNextForRaiting')
            .setEmoji('⏩')
            .setLabel('Вперед')
            .setStyle(ButtonStyle.Primary)

        const buttonHome = new ButtonBuilder()
            .setCustomId('buttonHomeForRaiting')
            .setEmoji('🏠')
            .setLabel('Домой')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonDown, buttonHome, buttonNext);

        const embed = await generationPageForRaiting(page, maxUserList);

        const message = await interaction.editReply({
            embeds: [embed],
            components: [row]
        });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 })
        collector.on("collect", async subInteraction => {

            if (interaction.user.id !== subInteraction.user.id) return;

            if (subInteraction.isStringSelectMenu() || subInteraction.isChatInputCommand()) return;

            if (subInteraction.isButton()) {
                const customId = subInteraction.customId;

                await message.edit({
                    components: []
                })

                if (customId === 'buttonNextForRaiting') {
                    await subInteraction.deferUpdate();
                    page += 1;
                    const embed = await generationPageForRaiting(page, maxUserList);
                    if ((allUserDb.length / maxUserList) > page) {
                        buttonNext.setDisabled(false);
                    } else {
                        buttonNext.setDisabled(true);
                    }
                    buttonDown.setDisabled(false);
                    buttonHome.setDisabled(false);

                    await message.edit({
                        embeds: [embed],
                        components: [row]
                    });
                } else if (customId === 'buttonHomeForRaiting') {
                    await subInteraction.deferUpdate();
                    page = 1;
                    const embed = await generationPageForRaiting(page, maxUserList);

                    buttonNext.setDisabled(false);
                    buttonDown.setDisabled(true);
                    buttonHome.setDisabled(true);

                    await message.edit({
                        embeds: [embed],
                        components: [row]
                    });
                } else if (customId === 'buttonDownForRaiting') {
                    await subInteraction.deferUpdate();
                    page += -1;
                    const embed = await generationPageForRaiting(page, maxUserList);

                    if (page === 1) {
                        buttonDown.setDisabled(true);
                        buttonHome.setDisabled(true);
                    } else {
                        buttonDown.setDisabled(false);
                        buttonHome.setDisabled(false);
                    }

                    if ((allUserDb.length / maxUserList) < page) {
                        buttonNext.setDisabled(true);
                    } else {
                        buttonNext.setDisabled(false);
                    }

                    await message.edit({
                        embeds: [embed],
                        components: [row]
                    });
                }
            };
        });

        collector.on('end', () => {
            message.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Рейтинг')
                        .setDescription('Таблица лидеров закрыта')
                        .setColor(`#${colors.stable}`)
                ],
                components: []
            });
        });
    },
});