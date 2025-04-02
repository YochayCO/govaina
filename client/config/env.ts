import dotenv from 'dotenv'
dotenv.config(process.env.NODE_ENV === 'production' ? { path: '.env.production'} : { path: '.env.local' });