import './config/env'
import express from 'express'

import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes/index'

const port = process.env.PORT || 5173
const app = express()

app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler)

// Start http server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
