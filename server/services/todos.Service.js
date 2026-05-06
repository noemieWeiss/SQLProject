import * as todoModel from '../models/todoModel.js';

export const getUserTodos = (userId) => todoModel.getTodosByUserId(userId);
export const addTodo = (data) => todoModel.createTodo(data);
export const editTodo = (id, data) => todoModel.updateTodo(id, data);
export const removeTodo = (id) => todoModel.deleteTodo(id);
