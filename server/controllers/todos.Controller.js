import * as todosService from '../services/todos.Service.js';

export const getTodos = async (req, res, next) => {
  try {
    const todos = await todosService.getUserTodos(req.params.userId);
    res.json(todos);
  } catch (err) { next(err); }
};

export const createTodo = async (req, res, next) => {
  try {
    const todo = await todosService.addTodo(req.body);
    res.status(201).json(todo);
  } catch (err) { next(err); }
};

export const updateTodo = async (req, res, next) => {
  try {
    const todo = await todosService.editTodo(req.params.id, req.body);
    res.json(todo);
  } catch (err) { next(err); }
};

export const deleteTodo = async (req, res, next) => {
  try {
    await todosService.removeTodo(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
