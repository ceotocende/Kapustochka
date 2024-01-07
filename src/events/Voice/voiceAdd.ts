import { Colors, TextChannel } from "discord.js";
import { client } from "../..";
import { channelId } from '../../utils/servIds.json'
import { EmbedBuilder } from "@discordjs/builders";
import addVoiceTime from "../../database/functions/addVoiceTime";
import { colors } from "../../utils/config";
import { addBalance } from "../../database/functions/addBalance";
import addExp from "../../database/functions/addExp";

const map = new Map();

client.on('voiceStateUpdate', async (oldState, newState) => {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    const currentTime = Date.now();
    const channelLog = newState.guild.channels.cache.get(channelId.voiceLog) as TextChannel;

    if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
        map.set(newState.member!.id, currentTime);

        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Участник перешел в другой канал`, iconURL: `${newState.member?.user.displayAvatarURL()}` })
                    .setDescription(`${newState.member!.user.tag} перешел из канала ${oldChannel} в канал ${newChannel}`)
                    .setColor(Colors.Grey)
                    .setTimestamp()
            ]
        })
    }

    if (newState.channel !== null && oldChannel === null) {
        map.set(newState.member!.id, currentTime);

        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Участник присоединился к голосовому каналу`, iconURL: `${newState.member?.user.displayAvatarURL()}` })
                    .setDescription(`Участник ${newState.member}, присоединился к каналу ${newState.channel}`)
                    .setColor(Colors.Green)
                    .setTimestamp()
            ]
        })
    }

    if (oldChannel !== null && newChannel === null) {
        await addVoiceTime(`${oldState.member!.id}`, currentTime - map.get(newState.member!.id))

        
        await addBalance(newState.member!.id, 1, newState.guild, true);
        await addExp(newState.member!.id, newState.guild, currentTime - map.get(newState.member!.id), true);
        
        map.delete(newState.member!.id);
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Участник покинул голосовой канал`, iconURL: `${newState.member!.displayAvatarURL()}` })
                    .setDescription(`Участник ${newState.member}, покинул голосовой канал ${oldState.channel}`)
                    .setColor(Colors.Yellow)
                    .setTimestamp()
            ]
        })
    }


})