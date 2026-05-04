import * as todosService from '../services/todosService.js';

export const getTodos = async (req, res) => {
  const todos = await todosService.getUserTodos(req.params.userId);
  res.json(todos);
};

export const createTodo = async (req, res) => {
  const todo = await todosService.addTodo(req.body);
  res.status(201).json(todo);
};

export const updateTodo = async (req, res) => {
  const todo = await todosService.editTodo(req.params.id, req.body);
  res.json(todo);
};

export const deleteTodo = async (req, res) => {
  await todosService.removeTodo(req.params.id);
  res.status(204).send();
};
