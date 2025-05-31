
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -5
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }}
      className="group"
    >
      <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
        
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${color.includes('green') ? '#10b981, #059669' : color.includes('blue') ? '#3b82f6, #1d4ed8' : '#ef4444, #dc2626'})`
          }}
        />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
            {title}
          </CardTitle>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-5 w-5 text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300" />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              delay: 0.2 
            }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {change}
            </motion.p>
          )}
        </CardContent>
        
        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-white/10 to-transparent group-hover:h-full transition-all duration-500"
          initial={{ height: 0 }}
          whileHover={{ height: "100%" }}
        />
      </Card>
    </motion.div>
  );
};
