import { Guild, TextChannel, VoiceChannel } from 'discord.js';
import { Marry } from '../models/Marry';
import { Users } from '../models/Users';
import chekRank from '../../functions/chekRankDataBase';

export async function addBalance(id: string, bal: number, guild?: Guild, voice?: boolean) {
    const user = await Users.findOne({ where: { user_id: id } });

    if (!user) {
        const a = await Users.create({ user_id: id, balance: bal, bank: 0, exp: 0, rank: 0, cookie: 0 });
        a.save();
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