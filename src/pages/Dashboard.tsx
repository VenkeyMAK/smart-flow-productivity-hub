import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Task, getUserTasks, createTask, updateTask, deleteTask } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, AlertCircle, Plus, Search, Calendar, Moon, Sun, Settings, BarChart3 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-800/10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-600/20 dark:from-cyan-600/10 dark:to-teal-800/10"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              SmartToDo+
            </motion.h1>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-gray-700">
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-gray-700">
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </motion.div>
              <span className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                Welcome, {authState.user?.username}
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatsCard
            title="Completed Tasks"
            value={completedTasks}
            change="+12% from last week"
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-400 to-green-600"
          />
          <StatsCard
            title="Pending Tasks"
            value={pendingTasks}
            change={`${overdueTasks} overdue`}
            icon={Clock}
            color="bg-gradient-to-r from-blue-400 to-blue-600"
          />
          <StatsCard
            title="Overdue Tasks"
            value={overdueTasks}
            change="Needs attention"
            icon={AlertCircle}
            color="bg-gradient-to-r from-red-400 to-red-600"
          />
        </motion.div>

        {/* Actions Section */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </motion.div>
        </motion.div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <TaskForm
                task={editingTask || undefined}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Tasks Section */}
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Create your first task to get started!'}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <TaskCard
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
};
