import 'dotenv/config'
import express from 'express';
import connectDB from './config/db.js'
import cors from 'cors';
import todoRouter from './Routes/TodoRoute.js';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRouter)

app.get('/',(req, res)=>{
    res.send('Server running.....')
})

app.listen(port, ()=>{
    console.log(`Server running on ${port}`)
})