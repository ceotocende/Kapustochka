import sequelize from "../sequelize";
import { Model, Optional, DataTypes } from "sequelize";

interface RewardsInt {
     user_id: string;
     timely: number;
     daily: number;
     weekly: number;
     monthly: number;
     work: number;
};

interface RewardsOpt extends Optional<RewardsInt, 'user_id'> { };

export class Rewards extends Model<RewardsInt, RewardsOpt> implements RewardsInt {
    public user_id!: string;
    public timely!: number;
    public daily!: number;
    public weekly!: number;
    public monthly!: number;
    public work!: number;
}

Rewards.init({
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    timely: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    daily: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    weekly: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    monthly: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    work: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    }
},{ sequelize, tableName: 'rewards', createdAt: false, timestamps: false })