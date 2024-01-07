import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';

const { INTEGER, BIGINT, STRING } = DataTypes;

interface UserAttributes {
    user_id: string;
    balance: number;
    bank: number;
    exp: number;
    rank: number;
    cookie: number;
}

interface UsersCreateAt extends Optional<UserAttributes, 'user_id'> { };

export class Users extends Model<UserAttributes, UsersCreateAt> implements UserAttributes { 
    public user_id!: string;
    public balance!: number;
    public bank!: number;
    public exp!: number;
    public rank!: number;
    public cookie!: number;

    public async findOneUser(user_id: string): Promise<Users | null> {
        return Users.findOne({
            where: { user_id }
        });
    }
};

Users.init({
    user_id: {
        type: STRING,
        primaryKey: true
    },
    balance: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    bank: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    exp: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    rank: {
        type: INTEGER,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    cookie: {
        type: INTEGER,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
}, { sequelize, tableName: 'users', createdAt: false, timestamps: false });
