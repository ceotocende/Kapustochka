import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../..";
import { Users } from "../../database/models/Users";
import { colors, embedErrFromInteractions, embedErrFromUserDb, emoji } from "../../utils/config";
import { Robs } from "../../database/models/Rob";

const map = new Map();

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('ограбить')
        .setDescription('Выберите кого ограбить')
        .addUserOption(op => op
            .setName('user')
            .setDescription('Выберите пользователя')
            .setRequired(true)),
    async run(client, interaction) {
        const userTarget = interaction.options.getUser('user');
        const userDb = await Users.findOne({ where: { user_id: interaction.user.id } });
        const userTargetDb = await Users.findOne({ where: { user_id: userTarget?.id } });
        const robDb = await Robs.findOne({ where: { user_id: interaction.user.id } });

        const fine = [500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 15000];
        const dayСonclusions = [3, 2, 4];
        const randomFine = fine[Math.floor(Math.random() * fine.length)];
        const randomDayСonclusions = dayСonclusions[Math.floor(Math.random() * dayСonclusions.length)];
        const currentTime = Date.now();

        if (userTarget?.bot || userTarget!.id === interaction.user.id) {
            interaction.reply({
                embeds: [
                    embedErrFromInteractions
                ]
            })
        } else if (!userDb || !userTargetDb || !robDb) { 
            interaction.reply({
                embeds: [
                    embedErrFromUserDb
                ]
            })
        } else if (robDb.rob_time_conclusions > (currentTime - (robDb.rob_day_conclusions * 24 * 60 * 60 * 1000))) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                    .setDescription(`${interaction.user} вы находитесь в тюрьме, освобождение <t:${Math.floor(robDb.rob_time_conclusions / 1000)}:R>`)
                    .setTimestamp()
                    .setColor(`#${colors.stable}`)
                    .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                ]
            })
        } else if (robDb.time > (currentTime - (4 * 60 * 60 * 1000))) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                    .setDescription(`${interaction.user} вы уже грабили, попробуйте <t:${Math.floor((robDb.time + (4 * 60 * 60 * 1000))  / 1000)}:R>`)
                    .setTimestamp()
                    .setColor(`#${colors.stable}`)
                    .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                ]
            })
        } else {
            const randomEvent = Math.floor(Math.random() * 101);
            if (userTargetDb.balance <= 0) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                            .setDescription(`${interaction.user} не смог украсть ничего у ${userTarget}, так как его кошелек был пуст.`)
                            .setTimestamp()
                            .setColor(`#${colors.stable}`)
                            .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                    ]
                })
            } else {
                robDb.time += currentTime;
                robDb.save();

                if (randomEvent >= 0 && randomEvent <= 20) {
                    robDb.rob_count += 1;
                    robDb.rob_fail += 1;
                    robDb.save();
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                                .setDescription(`${interaction.user}, окружающие с напряженным вниманием смотрели на вас, и вы поняли, что лучше не воровать.`)
                                .setTimestamp()
                                .setColor(`#${colors.stable}`)
                                .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                        ]
                    })
                } else if (randomEvent > 21 && randomEvent <= 40) {
                    const randomSum = Math.floor(Math.random() * userDb.balance);
                    
                    userDb.balance -= randomSum;
                    userDb.save();
                    
                    robDb.rob_count += 1;
                    robDb.rob_fail += 1;
                    robDb.rob_lost += randomSum;
                    robDb.save();
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                                .setDescription(`${interaction.user}, во время ограбления вы не смогли украсть ничего, но потеряли **${randomSum.toLocaleString('ru-RU')}** ${emoji.money}.`)
                                .setTimestamp()
                                .setColor(`#${colors.stable}`)
                                .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                        ]
                    })
                } else if (randomEvent > 41 && randomEvent <= 60) {
                    const randomSum = Math.floor(Math.random() * userTargetDb.balance);
                    userTargetDb.balance -= randomSum;
                    userTargetDb.save();
                    
                    userDb.balance += randomSum;
                    userDb.save();

                    robDb.rob_count += 1;
                    robDb.rob_success += 1;
                    robDb.rob_earned += randomSum;
                    robDb.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                                .setDescription(`${interaction.user}, незаметно украл у ${userTarget} **${randomSum.toLocaleString('ru-RU')}** ${emoji.money}.`)
                                .setTimestamp()
                                .setColor(`#${colors.stable}`)
                                .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                        ]
                    })
                } else if (randomEvent > 61 && randomEvent <= 100) {
                    robDb.rob_count += 1;
                    robDb.rob_fail += 1;
                    robDb.save();
                    const msg = await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                                .setDescription(`${interaction.user}, вас арестовала полиция по статье 158 УК РФ\nВы можете выбрать между двумя вариантами: оплатить штраф (**${randomFine.toLocaleString('ru-RU')} **${emoji.money}) или остаться в тюрьме на **${randomDayСonclusions} дня**.`)
                                .setTimestamp()
                                .setColor(`#${colors.stable}`)
                                .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                        ],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('buttonForConclusionsPay')
                                    .setLabel('Оплатить штраф')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('buttonForConclusionsTrue')
                                    .setLabel('Сесть в тюрьму')
                                    .setStyle(ButtonStyle.Danger)
                            )
                        ]
                    })

                    const collector = msg.createMessageComponentCollector({componentType: ComponentType.Button, time: 15_000})

                    collector.on("collect", async subInteraction => {
                        if (interaction.user.id !== subInteraction.user.id) return;

                        if (subInteraction.isButton()) {
                            if (subInteraction.customId === 'buttonForConclusionsPay') {
                                if (userDb.balance < randomFine) {
                                    collector.stop();

                                    robDb.rob_time_conclusions += (currentTime + (randomDayСonclusions * 24 * 60 * 60 * 1000));
                                    robDb.rob_day_conclusions += randomDayСonclusions;
                                    robDb.save();
                                    
                                    map.set(interaction.user.id, true)

                                    await msg.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({ name: `Ограбление`, iconURL: `${subInteraction.guild?.iconURL()}` })
                                                .setDescription(`${interaction.user}, поскольку у вас нет на счету денег, мы посадили вас в тюрьму`)
                                                .setTimestamp()
                                                .setColor(`#${colors.stable}`)
                                                .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                                        ],
                                        components: []
                                    });
                                } else {
                                    userDb.balance -= randomFine;
                                    userDb.save();
                                    collector.stop();
                                    await msg.edit({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({ name: `Ограбление`, iconURL: `${subInteraction.guild?.iconURL()}` })
                                                .setDescription(`${interaction.user}, с вашего счета было списано **${randomFine.toLocaleString('ru-RU')}**${emoji.money}`)
                                                .setTimestamp()
                                                .setColor(`#${colors.stable}`)
                                                .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                                        ],
                                        components: []
                                    });
                                }
                            } else if (subInteraction.customId === 'buttonForConclusionsTrue') {
                                collector.stop();
                                 
                                robDb.rob_time_conclusions = 0;
                                robDb.rob_day_conclusions += randomDayСonclusions;
                                robDb.rob_time_conclusions += (currentTime + (randomDayСonclusions * 24 * 60 * 60 * 1000));
                                robDb.save();

                                map.set(interaction.user.id, true)

                                await msg.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({ name: `Ограбление`, iconURL: `${subInteraction.guild?.iconURL()}` })
                                            .setDescription(`${interaction.user}, вас посадили в тюрьму на **${randomDayСonclusions} дня**.`)
                                            .setTimestamp()
                                            .setColor(`#${colors.stable}`)
                                            .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                                    ]
                                })
                            }
                        }
                    });

                    collector.on('end', async () => {
                        if ((map.get(interaction.user.id) === null ?? undefined) || map.get(interaction.user.id) === false) {
                            robDb.rob_time_conclusions += (currentTime + (randomDayСonclusions * 24 * 60 * 60 * 1000));
                            robDb.rob_day_conclusions += randomDayСonclusions;
                            robDb.save();
                        }

                        await msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({ name: `Ограбление`, iconURL: `${interaction.guild?.iconURL()}` })
                                    .setDescription(`${interaction.user}, поскольку вы не ответили в течение 15 секунд, вас отправили в тюрьму без вашего согласия.`)
                                    .setTimestamp()
                                    .setColor(`#${colors.stable}`)
                                    .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${interaction.guild?.iconURL()}` })
                            ],
                            components: []
                        })
                    })
                }
            }
        }
    },
})