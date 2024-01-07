import { TextChannel, VoiceChannel } from "discord.js";
import { client } from "../..";
import { addBalance } from "../../database/functions/addBalance";
import addExp from "../../database/functions/addExp";
import { addMessage } from "../../database/functions/addMessage";
import messageReact from "../../functions/messageReacte";

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.inGuild()) return;
    await addBalance(message.author.id, 1, message.guild);
    addMessage(message.author.id);
    messageReact(message);
    await addExp(message.author.id, message.guild)
})