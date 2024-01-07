import { readdirSync } from "node:fs";
import { Command } from "../types";
import { SlashCommandBuilder } from "discord.js";

interface CommandInfo {
    name: string;
    description: string;
}

export default function getFilesAndFolders(nameOption: string): CommandInfo[] {

    const commandInfo: CommandInfo[] = [];

    for (const file of readdirSync(`./dist/commands/${nameOption}`)) {
        const module: Command = require('../../dist/commands/' + `${nameOption}` + '/' + file).default;
 
        if (module.structure instanceof SlashCommandBuilder) {
            const nameCommand = module.structure.name.charAt(0).toUpperCase() + module.structure.name.slice(1);
            
            const descCommand = module.structure.description;
            
            commandInfo.push({ name: nameCommand, description: descCommand })
        }
    }

    return commandInfo;
}