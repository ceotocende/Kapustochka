import { Raiting } from '../models/Raiting';

export async function addMessage(id: string) {
    const user = await Raiting.findOne({ where: { user_id: id } });

    if (!user) {
        const a = await Raiting.create({ user_id: id, message: 1, message_timely: 1, voice_time: 0, voice_time_timely: 0 });
        a.save();
    }
    if (user?.user_id === id) {
        user.message = Number(user.message) + 1;
        user.message_timely = Number(user.message_timely) + 1;
        user.save();
    }
}