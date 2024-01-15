import cron from 'node-cron'
import { Client, EmbedAssertions, EmbedBuilder, Guild, GuildMember, Role, TextChannel } from 'discord.js';
import { Raiting as usersMessages } from '../database/models/Raiting';
import { Op, Sequelize } from 'sequelize';
import { channelId } from '../utils/servIds.json';
import { colors } from '../utils/config';

export default async function getTopChat(client: Client) {
    const eventsMessages = cron.schedule('0 22 * * 7', async () => {
        usersMessages.sync();
        const maxMessageTimelyRecord = await usersMessages.findAll({
            attributes: [
                'user_id',
                [Sequelize.fn('max', Sequelize.col('message_timely')), 'message_timely']
            ],
            group: ['user_id'],
            order: [[Sequelize.fn('max', Sequelize.col('message_timely')), 'DESC']],
            limit: 5
        });

        const guild = client.guilds.cache.get('743526389634039810');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Подводим недельные итоги активности в чате` })
            .setDescription('Напоминаю, что все победители получают роль за активность в чате.')
            .setThumbnail('https://cdn.discordapp.com/attachments/1190500593626779678/1192062528180715562/dd8fbe84e4f3d93a7ab9077f9f221910.png?ex=65a7b5be&is=659540be&hm=709b6d60edd0f1198e279a0fc0c13993574bf267f5a9ea535560d4f16e5f12c5&')
            .setColor(`#${colors.stable}`)

        let counter = 1;
        maxMessageTimelyRecord.forEach(i => {
            embed.addFields({
                name: `${counter}. место`,
                value: `<@${i.user_id}> написал \`${i.message_timely}\` сообщений!\nПоздравляем!`
            })
            counter++;
        });

        const channelAdm = client.channels.cache.get(channelId.serverLogs) as TextChannel;
        const channel = client.channels.cache.get(channelId.readyChannel) as TextChannel;

        channel.send({
            content: `@here`,
            embeds: [embed]
        })

        const role = guild!.roles.cache.get("1155576169186467952") as Role;

        const clearUsersMessages = await usersMessages.update({ message_timely: 0 }, { where: {} });

        for (let a = 0; a < maxMessageTimelyRecord.length; ++a) {
            const targetMember = await guild?.members.fetch(maxMessageTimelyRecord[a].user_id);
            if (targetMember) {
                try {
                    await targetMember.roles.remove(role!.id);
                    await channelAdm.send({ content: `Роль ${role!} успешно снята c пользователя ${targetMember}` });
                } catch (error) {
                    await channelAdm.send({ content: `Не удалось снять роль с ${targetMember}` });
                }
            } else {
                return await channelAdm.send({ content: 'Указанный пользователь не найден' });
            }
        }

        if (role) {
            maxMessageTimelyRecord.forEach(async (userId) => {
                const member = await guild!.members.fetch(`${userId.user_id}`);
                if (member) {
                    try {
                        await member.roles.add(role.id);
                        channelAdm.send(`Роль ${role} успешно выдана пользователю ${member.user}`);
                    } catch (error) {
                        console.error(`Произошла ошибка при выдачи роли пользователю ${member.user}:`, error);
                        channelAdm.send(`Произошла ошибка при выдачи роли пользователю ${member.user}`);
                    }
                } else {
                    channelAdm.send(`Пользователь с ID <@${userId.user_id}> не найден`);
                }
            });
        } else {
            channelAdm.send('Роль не найдена');
        }
    });
    eventsMessages
}