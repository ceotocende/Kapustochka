import { Marry } from "./models/Marry";
import { Raiting } from "./models/Raiting";
import { Users } from "./models/Users";
import { Voting } from "./models/Voting";
import sequelize from "./sequelize";

Users;
Marry;
Raiting;
Voting;

try {
    sequelize.sync();
    sequelize.authenticate();
    console.log(`[${sequelize.getDatabaseName()}]: авторизованна`)
} catch (err) {
    console.log(`[Произошла ошибка в базе данных]: ${err}`)
}

export default sequelize;