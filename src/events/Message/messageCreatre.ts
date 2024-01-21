import { TextChannel, VoiceChannel } from "discord.js";
import { client } from "../..";
import { addBalance } from "../../database/functions/addBalance";
import addExp from "../../database/functions/addExp";
import { addMessage } from "../../database/functions/addMessage";
import messageReact from "../../functions/messageReacte";
import { guild_id } from "../../utils/servIds.json";
import addUserToDatabase from "../../database/functions/addUserToDatabase";

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.inGuild()) return;
    if (message.guild.id !== guild_id) return;
    await addUserToDatabase(message.id);
    await addBalance(message.author.id, 1, message.guild);
    addMessage(message.author.id);
    messageReact(message);
    await addExp(message.author.id, message.guild)
})