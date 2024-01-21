import { client } from "../..";
import destroyUserToDatabase from "../../database/functions/destroyUserToDatabase";
import { guild_id } from "../../utils/servIds.json";

client.on('guildMemberRemove', async (member) => {
    if (member.guild.id !== guild_id) return;
    if (member.user.bot) return;

    await destroyUserToDatabase(member.id);
})