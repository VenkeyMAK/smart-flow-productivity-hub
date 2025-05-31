
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { db, createUser } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for default admin credentials
      if (email === 'admin' && password === 'admin123') {
        // Create or find admin user
        let adminUser = await db.users.where('email').equals('admin@smarttodo.com').first();
        if (!adminUser) {
          adminUser = await createUser({
            username: 'Admin',
            email: 'admin@smarttodo.com',
            passwordHash: btoa('admin123'),
            settings: {
              theme: 'light',
              notificationSounds: true,
              defaultCategory: 'work'
            }
          });
        }
        
        login(adminUser);
        toast({
          title: "Admin Login Successful!",
          description: "Welcome to the admin dashboard.",
        });
        navigate('/admin');
        return;
      }

      // Regular user login
      const user = await db.users.where('email').equals(email).first();
      if (user && user.passwordHash === btoa(password)) {
        login(user);
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setEmail('admin');
    setPassword('admin123');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="space-y-4 md:space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-white/80 text-sm md:text-base">
            Sign in to your SmartToDo+ account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm md:text-base">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm md:text-base">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 text-sm md:text-base py-2 md:py-3" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Button 
              type="button"
              onClick={handleAdminLogin}
              className="bg-orange-500/80 hover:bg-orange-600/90 text-white border border-orange-400/50 transition-all duration-300 text-sm md:text-base py-2 md:py-3 px-4" 
            >
              Admin
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm md:text-base">
          <span className="text-white/80">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-white hover:text-white/80 underline font-medium transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
};
