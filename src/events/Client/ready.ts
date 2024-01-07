import { ActivityType, TextChannel } from "discord.js";
import { client } from "../..";
import sequelize from "../../database/dbsync";
import getTopChat from "../../cron/getTopChat";
import getTopVoice from "../../cron/getTopVoice";
import { channelId } from '../../utils/servIds.json';

client.once('ready', () => {
    console.log('Logged in as: ' + client.user?.tag);
    const testChannel = client.channels.cache.get(channelId.serverLogs) as TextChannel;
    testChannel.send('Привет, я работаю стабильно!')
    sequelize
    client.user?.setActivity('капусту', { type: ActivityType.Playing });
    client.user?.setStatus("idle")

    getTopChat(client);
    getTopVoice(client);
});