import { Raiting } from '../models/Raiting';
import addUserToDatabase from './addUserToDatabase';

export async function addMessage(id: string) {
    const user = await Raiting.findOne({ where: { user_id: id } });

    if (!user) {
        await addUserToDatabase(id);
    }
    if (user?.user_id === id) {
        user.message = Number(user.message) + 1;
        user.message_timely = Number(user.message_timely) + 1;
        user.save();
    }
}