import { DataSource } from "typeorm";
import { Member } from "./entities/Member";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'calebtest',
    synchronize: true,
    logging: false,
    entities: [Member],
    migrations: [],
    subscribers: [],
});
