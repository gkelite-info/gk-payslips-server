import express from 'express';
import dbInit from './init.ts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.DBPORT || 5000;

app.use(express.json());

dbInit();

app.get('/', (req, res) => {
    res.send("Hello user");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    return
});