import { Raiting } from "../models/Raiting";
import { Rewards } from "../models/Rewards";
import { Users } from "../models/Users";

export default async function destroyUserToDatabase(user: string) {
    const userDb = await Users.findOne({ where: { user_id: user } });
    const rewardsDb = await Rewards.findOne({ where: { user_id: user } });
    const raitingDb = await Raiting.findOne({ where: { user_id: user } });

    !userDb ? 0 : Users.destroy({ where: { user_id: user } });
    !rewardsDb ? 0 : Raiting.destroy({ where: { user_id: user } });
    !raitingDb ? 0 : Rewards.destroy({ where: { user_id: user } });
}