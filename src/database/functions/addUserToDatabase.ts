import { Raiting } from "../models/Raiting";
import { Rewards } from "../models/Rewards";
import { Robs } from "../models/Rob";
import { Users } from "../models/Users";

export default async function addUserToDatabase(user: string) {
    const userDb = await Users.findOne({ where: { user_id: user } });
    const rewardsDb = await Rewards.findOne({ where: { user_id: user } });
    const raitingDb = await Raiting.findOne({ where: { user_id: user } });
    const robsDb = await Robs.findOne({ where: { user_id: user } });

    if (!userDb) {
        const newCreate = Users.create({ user_id: user, balance: 0, bank: 0, cookie: 0, exp: 0, rank: 0 });
        (await newCreate).save();
    };

    if (!rewardsDb) {
        const newCreate = Rewards.create({ user_id: user, daily: 0, monthly: 0, timely: 0, weekly: 0, work: 0});
        (await newCreate).save();
    };

    if (!raitingDb) {
        const newCreate = Raiting.create({ user_id: user, message: 0, message_timely: 0, voice_time: 0, voice_time_timely: 0 });
        (await newCreate).save();
    };

    if (!robsDb) {
        const newCreate = Robs.create({ user_id: user, rob_count: 0, rob_earned: 0, rob_fail: 0, rob_lost: 0, rob_success: 0, time: 0, rob_time_conclusions: 0, rob_day_conclusions: 0 });
        (await newCreate).save();
    };
}