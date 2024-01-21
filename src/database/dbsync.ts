import { Marry } from "./models/Marry";
import { Raiting } from "./models/Raiting";
import { Rewards } from "./models/Rewards";
import { Robs } from "./models/Rob";
import { Users } from "./models/Users";
import { Voting } from "./models/Voting";
import sequelize from "./sequelize";

Users;
Marry;
Raiting;
Voting;
Rewards;
Robs;

try {
    sequelize.sync();
    sequelize.authenticate();
    console.log(`[${sequelize.getDatabaseName()}]: авторизованна`)
} catch (err) {
    console.log(`[Произошла ошибка в базе данных]: ${err}`)
}

export default sequelize;