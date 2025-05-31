import Dexie, { Table } from 'dexie';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  settings: {
    theme: 'light' | 'dark';
    notificationSounds: boolean;
    defaultCategory: string;
  };
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: Date;
  dueTime?: string;
  estimatedEffort?: number;
  tags: string[];
  category: string;
  subtasks: Subtask[];
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: Date;
  };
  dependencies: string[];
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export interface AppSettings {
  userId: string;
  theme: 'light' | 'dark';
  enableNotifications: boolean;
  defaultView: 'list' | 'kanban' | 'calendar';
}

export class SmartTodoDatabase extends Dexie {
  users!: Table<User>;
  tasks!: Table<Task>;
  categories!: Table<Category>;
  settings!: Table<AppSettings>;

  constructor() {
    super('SmartTodoDatabase');
    this.version(1).stores({
      users: 'id, username, email',
      tasks: 'id, userId, status, priority, dueDate, category, createdAt',
      categories: 'id, userId, name',
      settings: 'userId'
    });
  }
}

export const db = new SmartTodoDatabase();

// Helper functions
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
  const user: User = {
    id: uuidv4(),
    ...userData,
    createdAt: new Date()
  };
  await db.users.add(user);
  return user;
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  const task: Task = {
    id: uuidv4(),
    ...taskData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await db.tasks.add(task);
  return task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  await db.tasks.update(id, { ...updates, updatedAt: new Date() });
};

export const deleteTask = async (id: string) => {
  await db.tasks.delete(id);
};

export const getUserTasks = async (userId: string) => {
  return await db.tasks.where('userId').equals(userId).toArray();
};
