import express from 'express';
import { createTask, deleteTodo, editTodo, getTodos } from '../Controllers/TodoControllers.js';

const todoRouter = express.Router();

todoRouter.post('/create', createTask);
todoRouter.get('/get', getTodos);
todoRouter.delete('/:id', deleteTodo);
todoRouter.patch('/:id', editTodo);

export default todoRouter