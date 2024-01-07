import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../sequelize';

const { INTEGER, BIGINT, STRING } = DataTypes;

interface RaitingAttributes {
    user_id: string;
    message: number;
    voice_time: number;
    voice_time_timely: number;
    message_timely: number;
}

interface RaitingCreateAt extends Optional<RaitingAttributes, 'user_id'> { };

export class Raiting extends Model<RaitingAttributes, RaitingCreateAt> implements RaitingAttributes { 
    public user_id!: string;
    public message!: number;
    public voice_time!: number;
    public voice_time_timely!: number;
    public message_timely!: number;

    public async findOneUser(user_id: string): Promise<Raiting | null> {
        return Raiting.findOne({
            where: { user_id }
        });
    }
};

Raiting.init({
    user_id: {
        type: STRING,
        primaryKey: true
    },
    message: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    voice_time: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    voice_time_timely: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    message_timely: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    }
}, { sequelize, tableName: 'raiting', createdAt: false, timestamps: false });
