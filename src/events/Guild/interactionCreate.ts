import { client } from "../..";
import addUserToDatabase from "../../database/functions/addUserToDatabase";
import { guild_id } from "../../utils/servIds.json";

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) {
        interaction.reply(`Вы можете использовать команды только на сервере`)
        return;
    }
    if (interaction.guild!.id !== guild_id) return;

    await addUserToDatabase(interaction.user.id);

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        command?.run(client, interaction);
    } catch (err) {
        console.error(err);
    };
});