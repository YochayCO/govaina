import './config/env';
import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = 3001;

app.use(cors({
    origin: process.env.GOVAINA_CLIENT_URL,
}));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is up');
});

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
