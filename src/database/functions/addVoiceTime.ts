import { Raiting } from "../models/Raiting";
import { Users } from "../models/Users";
import { addBalance } from "./addBalance";
import addUserToDatabase from "./addUserToDatabase";

export default async function addVoiceTime(id: string, time: number) {
    const user = await Users.findOne({ where: { user_id: id } });
    const userVcoice = await Raiting.findOne({ where: { user_id: id } });
    const userVoice = await Raiting.findOne({ where: { user_id: id } });

    if (!user || !userVcoice) {
        await addUserToDatabase(id);
    }

    if (isNaN(time)) {
        return;
    } else if (!userVoice) {
        const newUser = await Raiting.create({ user_id: id, voice_time: time, voice_time_timely: time, message: 0, message_timely: 0, });
        newUser.save();
    } else if (userVoice.user_id === id) {
        userVoice.voice_time = Number(userVoice.voice_time) + time;
        userVoice.voice_time_timely = Number(userVoice.voice_time_timely) + time;
        userVoice.save();
    } else {
        console.log('!error function addVoiceTime please chek this function!')
    }
}