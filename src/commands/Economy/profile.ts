import { ActionRowBuilder, ComponentType, EmbedBuilder, InteractionResponse, Message, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { client } from "../..";
import { Marry } from "../../database/models/Marry";
import { colors, embedErrFromUserDb } from "../../utils/config";
import { Raiting } from "../../database/models/Raiting";
import { Users } from "../../database/models/Users";
import calculateLvl from "../../functions/calculateLvl";
import { emoji } from "../../utils/servIds.json";
import formatTimeForProfile from "../../functions/formatTimeForProfile";
import { Robs } from "../../database/models/Rob";
import { Rewards } from "../../database/models/Rewards";
import addUserToDatabase from "../../database/functions/addUserToDatabase";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('профиль')
        .setDescription('Посмотреть свой или профиль участника')
        .addUserOption(op => op
            .setName('user')
            .setDescription('Выбрать участника')
            .setRequired(false)),
    async run(client, interaction) {
        const targetUser = interaction.options.getUser('user') ?? interaction.user;

        const userDbMarry = await Marry.findOne({ where: { user_id_first: targetUser.id } }) ?? await Marry.findOne({ where: { user_id_second: targetUser.id } });
        const userRating = await Raiting.findOne({ where: { user_id: targetUser.id } });
        const userDb = await Users.findOne({ where: { user_id: targetUser.id } });
        const robDb = await Robs.findOne({ where: { user_id: targetUser.id } });
        const rewardsDb = await Rewards.findOne({ where: { user_id: targetUser.id } });

        let msg: InteractionResponse;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Профиль участника: ${targetUser.username}` })
            .setFields(
                {
                    name: `Баланс`,
                    value: `**${(userDb?.balance ?? 0).toLocaleString('ru-RU')}**${emoji.serverCurrency}`
                },
                {
                    name: `Ранг и опыт`,
                    value: `Ранг: \n**${userDb?.rank ?? 0}**\nОпыт: \n**${(userDb?.exp ?? 0).toLocaleString('ru-RU')}** EXP из **${(calculateLvl(userDb?.rank ?? 0)).toLocaleString('ru-RU')}** EXP`
                }
            )
            .setColor(`#${colors.stable}`)
            .setThumbnail(targetUser.avatarURL())

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('StringSelectMenuOption')
            .setPlaceholder('Выберите нужное')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue('selectMenuForMarry')
                    .setLabel('Отношения')
                    .setDescription('Посомотерть данные об отношениях')
                    .setEmoji('💍'),
                new StringSelectMenuOptionBuilder()
                    .setValue(`selectMenuForViewRobs`)
                    .setLabel('Ограбления')
                    .setDescription('Посмотреть данные об огроблениях')
                    .setEmoji('💰'),
                new StringSelectMenuOptionBuilder()
                    .setValue(`selectMenuForViewActivity`)
                    .setLabel('Активности')
                    .setDescription('Посомтреть данные об активностях')
                    .setEmoji('🥇')
            )

        const rowMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)

        if (!targetUser || targetUser.id === interaction.user.id) {

            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue('selectMenuForEdit')
                    .setLabel('Изменить данные')
                    .setDescription('Изменить или добавить данные профиля')
                    .setEmoji('✏️'),
                new StringSelectMenuOptionBuilder()
                    .setValue(`selectMenuForViewRewards`)
                    .setLabel('Награды')
                    .setDescription('Посмотреть какие награды доступны')
                    .setEmoji('💵'),
            )

            msg = await interaction.reply({
                embeds: [embed],
                components: [rowMenu]
            })
        } else {
            msg = await interaction.reply({
                embeds: [embed],
                components: [rowMenu]
            })
        }
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 300000 });

        collector.on("collect", async subInteraction => {
            if (subInteraction.user.id !== interaction.user.id) return;

            if (subInteraction.isStringSelectMenu()) {
                const labelId = [
                    'selectMenuForMarry',
                    'selectMenuForViewRobs',
                    'selectMenuForViewActivity',
                    'selectMenuForEdit',
                    'selectMenuForViewRewards',
                    'selectMenuForBack'
                ];

                if (labelId.some(greting => subInteraction.values.includes(greting))) {
                    switch (subInteraction.values[0]) {
                        case 'selectMenuForMarry':
                            selectMenu.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`selectMenuForBack`)
                                    .setLabel('Вернуться')
                                    .setDescription('Вернуться на главную страницу')
                                    .setEmoji('🔙'),
                            )
                            await subInteraction.deferUpdate();
                            let text = '';

                            let userId = '';

                            if (!userDbMarry) {
                                text = 'Участник не состоит в отношениях'
                            }

                            if (userDbMarry?.user_id_first === targetUser.id) {
                                userId = userDbMarry.user_id_second;
                            } else if (userDbMarry?.user_id_second === targetUser.id) {
                                userId = userDbMarry.user_id_first;
                            }

                            msg.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({ name: `Отношения участника: ${targetUser.username}` })
                                        .setFields(
                                            {
                                                name: `Отношения`,
                                                value: `${text === '' ? `Участник состоит в отношениях с <@${userId}>\nОтношения продолжаются уже \`${formatTimeForProfile(Date.now() - userDbMarry!.time)}\`` : text}`
                                            }
                                        )
                                        .setColor(`#${colors.stable}`)
                                        .setThumbnail(targetUser.avatarURL())
                                ],
                                components: [rowMenu]
                            });
                            break;
                        case 'selectMenuForViewRobs':
                            selectMenu.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`selectMenuForBack`)
                                    .setLabel('Вернуться')
                                    .setDescription('Вернуться на главную страницу')
                                    .setEmoji('🔙'),
                            )
                            if (!robDb) {
                                await subInteraction.deferReply({
                                    ephemeral: true
                                })
                                await subInteraction.followUp({
                                    content: `Произошла ошибка попробуйте еще раз`
                                })

                                await addUserToDatabase(targetUser.id)

                                return;
                            } else if (robDb.rob_count !== 0) {
                                await subInteraction.deferUpdate();
                                let sucRob = '';
                                let falseRob = '';
                                if (robDb.rob_success !== 0) {
                                    sucRob = `\n- ${robDb.rob_success} успешных`
                                }

                                if (robDb.rob_fail !== 0) {
                                    falseRob = `\n- ${robDb.rob_fail} провальных`
                                }

                                msg.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({ name: `Отношения участника: ${targetUser.username}` })
                                            .addFields({
                                                name: `Ограбления`,
                                                value: `За все свое время участник совершил ${robDb.rob_count} ограбление${sucRob}${falseRob}`
                                            })
                                            .setColor(`#${colors.stable}`)
                                            .setThumbnail(targetUser.avatarURL())
                                    ],
                                    components: [rowMenu]
                                });
                            } else {
                                await subInteraction.deferUpdate();
                                msg.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({ name: `Ограбления участника: ${targetUser.username}` })
                                            .addFields({
                                                name: `Ограбления`,
                                                value: `За все свое время участник не совершал ограблений`
                                            })
                                            .setColor(`#${colors.stable}`)
                                            .setThumbnail(targetUser.avatarURL())
                                    ],
                                    components: [rowMenu]
                                });
                            }
                            break;
                        case 'selectMenuForViewActivity':
                            selectMenu.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`selectMenuForBack`)
                                    .setLabel('Вернуться')
                                    .setDescription('Вернуться на главную страницу')
                                    .setEmoji('🔙'),
                            )
                            await subInteraction.deferUpdate();
                            msg.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({ name: `Отношения участника: ${targetUser.username}` })
                                        .setFields(
                                            {
                                                name: `Общее время в голсовых каналх`,
                                                value: `\`${formatTimeForProfile(userRating?.voice_time ?? 0)}\``
                                            },
                                            {
                                                name: `Всего сообщений`,
                                                value: `**${(userRating?.message ?? 0).toLocaleString('ru-RU')}**`
                                            }
                                        )
                                        .setColor(`#${colors.stable}`)
                                        .setThumbnail(targetUser.avatarURL())
                                ],
                                components: [rowMenu]
                            })
                            break;
                        case 'selectMenuForViewRewards':
                            selectMenu.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`selectMenuForBack`)
                                    .setLabel('Вернуться')
                                    .setDescription('Вернуться на главную страницу')
                                    .setEmoji('🔙'),
                            )
                            if (!rewardsDb) {
                                await subInteraction.deferReply({
                                    ephemeral: true
                                })
                                await subInteraction.followUp({
                                    content: `Произошла ошибка попробуйте еще раз`
                                })

                                await addUserToDatabase(targetUser.id)

                                return;
                            } else {
                                await subInteraction.deferUpdate();
                                let timely = '';
                                let daily = '';
                                let weekly = '';
                                let monthly = '';
                                let work = '';

                                if (rewardsDb.timely === 0 || rewardsDb.daily === 0 || rewardsDb.weekly === 0 || rewardsDb.monthly === 0 || rewardsDb.work === 0) {
                                    if (rewardsDb.timely === 0) {
                                        timely = '\n- Временная награда (`/временная_награда`)'
                                    }
                                    if (rewardsDb.daily === 0) {
                                        daily = '\n- Дневная награда (`/ежедневная_награда`)'
                                    }
                                    if (rewardsDb.weekly === 0) {
                                        weekly = '\n- Недельная награда (`/еженедельная_награда`)'
                                    }
                                    if (rewardsDb.monthly === 0) {
                                        monthly = '\n- Месячная награда (`/ежемесячная_награда`)'
                                    }
                                    if (rewardsDb.work === 0) {
                                        work = '\n- Доступна работа (`/работа`)'
                                    }
                                } else {
                                    timely = 'Нет доступных наград'
                                }

                                msg.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({ name: `Отношения участника: ${targetUser.username}` })
                                            .addFields(
                                                {
                                                    name: `Доступные награды`,
                                                    value: `${timely}${daily}${weekly}${monthly}${work}`
                                                }
                                            )
                                            .setColor(`#${colors.stable}`)
                                            .setThumbnail(targetUser.avatarURL())
                                    ],
                                    components: [rowMenu]
                                });
                            }
                            break;
                        case 'selectMenuForEdit':
                            selectMenu.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`selectMenuForBack`)
                                    .setLabel('Вернуться')
                                    .setDescription('Вернуться на главную страницу')
                                    .setEmoji('🔙'),
                            )
                            await subInteraction.deferReply({
                                ephemeral: true
                            })
                            await subInteraction.followUp({
                                content: `Тут пока ничего нет`
                            })
                            break;
                        case 'selectMenuForBack':
                            await subInteraction.deferUpdate();
                            msg.edit({
                                embeds: [embed],
                                components: [rowMenu]
                            })
                            break;
                        default:
                            collector.stop();
                            break;
                    }
                }
            }
        })

        collector.on('end', async () => {
            await msg.edit({
                components: []
            })
        })
    },
})