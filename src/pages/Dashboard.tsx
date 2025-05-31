
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useAuth } from '@/contexts/AuthContext';
import { Task, getUserTasks, createTask, updateTask, deleteTask } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, AlertCircle, Plus, Search, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [authState.user]);

  const loadTasks = async () => {
    if (authState.user) {
      try {
        const userTasks = await getUserTasks(authState.user.id);
        setTasks(userTasks);
      } catch (error) {
        toast({
          title: "Error loading tasks",
          description: "Failed to load your tasks.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateTask = async (taskData: any) => {
    if (!authState.user) return;

    try {
      await createTask({
        userId: authState.user.id,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        estimatedEffort: taskData.estimatedEffort,
        tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
        category: taskData.category,
        subtasks: [],
        dependencies: [],
        timeSpent: 0
      });

      await loadTasks();
      setShowTaskForm(false);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error creating task",
        description: "Failed to create the task.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;

    try {
      await updateTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        estimatedEffort: taskData.estimatedEffort,
        tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
        category: taskData.category
      });

      await loadTasks();
      setEditingTask(null);
      setShowTaskForm(false);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Failed to update the task.",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      await updateTask(taskId, { status: newStatus });
      await loadTasks();
      toast({
        title: newStatus === 'completed' ? "Task completed!" : "Task reopened",
        description: newStatus === 'completed' ? "Great job!" : "Task marked as pending.",
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadTasks();
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        description: "Failed to delete the task.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const overdueTasks = tasks.filter(t => 
    t.dueDate && t.dueDate < new Date() && t.status !== 'completed'
  ).length;

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartToDo+
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {authState.user?.username}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Completed Tasks"
            value={completedTasks}
            change="+12% from last week"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatsCard
            title="Pending Tasks"
            value={pendingTasks}
            change={`${overdueTasks} overdue`}
            icon={Clock}
            color="bg-blue-500"
          />
          <StatsCard
            title="Overdue Tasks"
            value={overdueTasks}
            change="Needs attention"
            icon={AlertCircle}
            color="bg-red-500"
          />
        </div>

        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {/* Tasks Section */}
        <div className="grid gap-4">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Create your first task to get started!'}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};
