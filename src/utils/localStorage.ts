
import { Task } from "../types/kanban";

const STORAGE_KEY = 'kanban_tasks';

export const saveTasksToLocalStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

export const getTasksFromLocalStorage = (): Task[] => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error getting tasks from localStorage:', error);
    return [];
  }
};
