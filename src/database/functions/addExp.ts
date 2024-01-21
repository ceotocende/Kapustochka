import { Guild, TextChannel, VoiceChannel } from "discord.js";
import { Users } from "../models/Users";
import { addBalance } from "./addBalance";
import chekRank from "../../functions/chekRankDataBase";
import addUserToDatabase from "./addUserToDatabase";

export default async function addExp(id: string, guild: Guild, exp?: number, voice?: boolean) {
    const user = await Users.findOne({ where: { user_id: id } });

    if (!user) {
        await addUserToDatabase(id);
    } else if (user.user_id === id) {
        if (voice) {
            if (!exp) {
                return;
            } else {
                user.exp = Number(user.exp) + Math.floor(exp / 7000)
                user.save();
                await chekRank(id, guild)
            }
        } else if (!exp) {
            user.exp = Number(user.exp) + 16;
            user.save();
            await chekRank(id, guild)
        } else {
            user.exp = Number(user.exp) + exp;
            user.save();
            await chekRank(id, guild)
        }
    }
}