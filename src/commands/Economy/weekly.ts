import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, InteractionResponse, Message, SlashCommandBuilder, TextChannel, time } from "discord.js";
import { client } from "../..";
import { Rewards } from "../../database/models/Rewards";
import { colors, embedErrFromUserDb, emoji, photoServer, rewards, rewardsTiming } from "../../utils/config";
import { Users } from "../../database/models/Users";
import { channelId } from "../../utils/servIds.json";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('еженедельная_награда')
        .setDescription('Получить свою еженедельную награду (обновляется раз в неделю)'),
    async run(client, interaction) {
        const rewardsDb = await Rewards.findOne({ where: { user_id: interaction.user.id } });
        const userDb = await Users.findOne({ where: { user_id: interaction.user.id } });
        const currentTime = Date.now();

        if (!rewardsDb || !userDb) {
            interaction.reply({
                embeds: [embedErrFromUserDb]
            })
        } else {
            if (rewardsDb.weekly <= (currentTime - rewardsTiming.weekly)) {
                rewardsDb.weekly = 0;
                rewardsDb.weekly += currentTime;
                userDb.balance += rewards.weekly;
                await userDb.save();
                await rewardsDb.save();

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Еженедельная награда награда` })
                    .setDescription(`${interaction.user} вы забрали свои **${rewards.weekly.toLocaleString('ru-RU')}** ${emoji.money}.`)
                    .setColor(`#${colors.stable}`)
                    .setThumbnail(`${interaction.user.avatarURL()}`)
                    .setTimestamp()
                    .setFields({
                        name: 'Ваша следующая награда будет доступна',
                        value: `<t:${Math.floor((currentTime + rewardsTiming.weekly) / 1000)}:R>`
                    })
                    .setFooter({ text: `${interaction.guild?.name}`, iconURL: `${photoServer.serverAvatar}` })

                const message = await interaction.reply({
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('buttonFromWeeklyReward').setLabel('Отправить уведомление').setStyle(ButtonStyle.Primary))
                    ]
                })

                const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 })
                collector.on("collect", async subInteraction => {
                    if (subInteraction.user.id !== interaction.user.id) return;

                    if (subInteraction.isButton()) {
                        await subInteraction.deferReply({
                            ephemeral: true
                        });
                        if (subInteraction.customId === 'buttonFromWeeklyReward') {
                            collector.stop();
                            await subInteraction.followUp({
                                content: `Уведомление успешно поставленно`,
                                ephemeral: true,
                                fetchReply: true
                            });

                            const timer = setTimeout(async () => {
                                const channel = interaction.guild?.channels.cache.get(channelId.basketChannel) as TextChannel;
                                await channel.send({
                                    content: `${subInteraction.user}`,
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle(`Уведомление об еженедельнной награде`)
                                            .setDescription(`Вы можете забрать свою временную награду`)
                                            .setColor(`#${colors.stable}`)
                                            .setTimestamp()
                                    ]
                                })
                            }, rewardsTiming.weekly);

                            timer;
                        }
                    }
                })

                collector.on('end', () => {
                    message.edit({
                        components: [],
                        embeds: [embed]
                    })
                })
            } else {
                interaction.reply({
                    ephemeral: true,
                    content: `Ваша следующая нагарада <t:${Math.floor((currentTime + rewardsTiming.weekly) / 1000)}:R>`
                });
            }
        }
    },
})