import { Guild, TextChannel, VoiceChannel } from 'discord.js';
import { Marry } from '../models/Marry';
import { Users } from '../models/Users';
import chekRank from '../../functions/chekRankDataBase';
import addUserToDatabase from './addUserToDatabase';

export async function addBalance(id: string, bal: number, guild?: Guild, voice?: boolean) {
    const user = await Users.findOne({ where: { user_id: id } });

    if (!user) {
        await addUserToDatabase(id);
    }
    if (user?.user_id === id) {
        user.balance = Number(user.balance) + bal;
        user.save();
    }

    if (voice) {
        if (!bal) {
            return;
        } else {
            if (!guild) {
                return;
            } else {
                user!.exp = Number(user!.exp) + Math.floor(bal! / 15000)
                user!.save();
                await chekRank(id, guild)
            }
        }
    }
}