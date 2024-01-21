import sequelize from "../sequelize";
import { Model, Optional, DataTypes } from "sequelize";

interface RobsInt {
     user_id: string;
     time: number;
     rob_success: number;
     rob_fail: number;
     rob_count: number;
     rob_earned: number;
     rob_lost: number;
     rob_time_conclusions: number;
     rob_day_conclusions: number;
};

interface RobsOpt extends Optional<RobsInt, 'user_id'> { };

export class Robs extends Model<RobsInt, RobsOpt> implements RobsInt {
    public user_id!: string;
    public time!: number;
    public rob_success!: number;
    public rob_fail!: number;
    public rob_count!: number;
    public rob_earned!: number;
    public rob_lost!: number;
    public rob_time_conclusions!: number;
    public rob_day_conclusions!: number;
}

Robs.init({
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    time: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    rob_time_conclusions: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    rob_success: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rob_fail: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rob_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rob_earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rob_lost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rob_day_conclusions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
},{ sequelize, tableName: 'robs', createdAt: false, timestamps: false })