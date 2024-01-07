import { Model, DataTypes, Optional, BOOLEAN } from 'sequelize';
import sequelize from '../sequelize';

const { INTEGER, BIGINT, STRING } = DataTypes;

interface VotingAttributes {
    voting_id: string;
    channel_id: string;
    voting_yes: number;
    voting_no: number;
    voting_name: string;
}

interface VotingCreateAt extends Optional<VotingAttributes, 'voting_id'> { };

export class Voting extends Model<VotingAttributes, VotingCreateAt> implements VotingAttributes { 
    public voting_id!: string;
    public channel_id!: string;
    public voting_yes!: number;
    public voting_no!: number;
    public voting_name!: string;

    public async findOneUser(voting_id: string): Promise<Voting | null> {
        return Voting.findOne({
            where: { voting_id }
        });
    }
};

Voting.init({
    voting_id: {
        type: STRING,
        primaryKey: true
    },
    channel_id: {
        type: STRING,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    voting_yes: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    voting_no: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    voting_name: {
        type: STRING,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    }
}, { sequelize, tableName: 'voting', createdAt: false, timestamps: false });
