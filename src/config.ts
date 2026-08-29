import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DBNAME as string;
const dbPort = process.env.DBPORT ? parseInt(process.env.DBPORT) : 5432;
const dbUsername = process.env.DBUSERNAME as string;
const dbPassword = process.env.DBPASSWORD as string;
const dbDriver = process.env.DBDRIVER as string;
const dbHostname = process.env.DBHOSTNAME as string;


function getConnetion() {
    return new Sequelize(dbName, dbUsername, dbPassword, {
        port: dbPort,
        host: dbHostname,
        dialect: "postgres"
    });
}

const sequelizeConnection = getConnetion();

export default sequelizeConnection;