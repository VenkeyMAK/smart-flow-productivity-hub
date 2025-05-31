
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskList } from '@/components/admin/TaskList';
import { Users, Target, TrendingUp, Settings, BarChart3, Activity, Shield, Database, Moon, Sun, ArrowLeft, Plus, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { generateSampleData } from '@/lib/sampleData';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: adminStats, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const users = await db.users.toArray();
      const tasks = await db.tasks.toArray();
      const completedTasks = tasks.filter(task => task.status === 'completed');
      const activeTasks = tasks.filter(task => task.status !== 'completed' && task.status !== 'archived');
      
      return {
        totalUsers: users.length,
        activeTasks: activeTasks.length,
        completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
        systemLoad: Math.floor(Math.random() * 40) + 10
      };
    },
  });

  const handleGenerateSampleData = async () => {
    try {
      await generateSampleData();
      await refetch();
      toast({
        title: "Sample Data Generated",
        description: "Sample users and tasks have been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sample data.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Data export functionality will be implemented soon.",
    });
  };

  const quickActions = [
    { 
      title: 'User Management', 
      icon: Users, 
      color: 'bg-blue-500',
      onClick: () => toast({ title: 'Coming Soon', description: 'User management feature will be available soon.' })
    },
    { 
      title: 'System Settings', 
      icon: Settings, 
      color: 'bg-gray-500',
      onClick: () => toast({ title: 'Coming Soon', description: 'System settings feature will be available soon.' })
    },
    { 
      title: 'Analytics', 
      icon: BarChart3, 
      color: 'bg-green-500',
      onClick: () => toast({ title: 'Coming Soon', description: 'Analytics dashboard will be available soon.' })
    },
    { 
      title: 'Security', 
      icon: Shield, 
      color: 'bg-red-500',
      onClick: () => toast({ title: 'Coming Soon', description: 'Security settings will be available soon.' })
    },
    { 
      title: 'Database', 
      icon: Database, 
      color: 'bg-purple-500',
      onClick: () => toast({ title: 'Coming Soon', description: 'Database management will be available soon.' })
    },
  ];

  const statsConfig = [
    { 
      title: 'Total Users', 
      value: adminStats?.totalUsers || 0, 
      change: '+12%', 
      icon: Users, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      title: 'Active Tasks', 
      value: adminStats?.activeTasks || 0, 
      change: '+8%', 
      icon: Target, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      title: 'Completion Rate', 
      value: `${adminStats?.completionRate || 0}%`, 
      change: '+5%', 
      icon: TrendingUp, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      title: 'System Load', 
      value: `${adminStats?.systemLoad || 0}%`, 
      change: '-3%', 
      icon: Activity, 
      color: 'from-orange-500 to-red-500' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-48 h-48 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-cyan-400/10 to-teal-600/10"
          animate={{ rotate: -360, scale: [1, 0.9, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header with Navigation */}
      <div className="relative z-10 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Manage your SmartToDo+ platform
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSampleData}
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300 hidden md:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Data
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300 hidden md:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={action.onClick}
                  className="h-20 md:h-24 w-full flex flex-col items-center justify-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 text-xs md:text-sm"
                >
                  <action.icon className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="font-medium text-center">{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Task List and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {/* Task List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TaskList />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    { user: 'John Doe', action: 'completed 5 tasks', time: '2 minutes ago', type: 'success' },
                    { user: 'Jane Smith', action: 'created new project', time: '15 minutes ago', type: 'info' },
                    { user: 'Mike Johnson', action: 'updated profile', time: '1 hour ago', type: 'warning' },
                    { user: 'Sarah Wilson', action: 'deleted task', time: '2 hours ago', type: 'error' },
                    { user: 'Admin', action: 'exported user data', time: '3 hours ago', type: 'info' },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 dark:text-white block truncate">
                            {activity.user}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-sm block truncate">
                            {activity.action}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
