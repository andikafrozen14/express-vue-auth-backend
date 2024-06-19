import cors from 'cors';
import * as dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";
import { AppDataSource } from "./data-source";
import memberRoutes from "./routes/MemberRoutes";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.SERVER_PORT;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/member", memberRoutes);

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.error(error));
