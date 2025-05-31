
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { createUser, db } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const existingUser = await db.users.where('email').equals(email).first();
      if (existingUser) {
        toast({
          title: "Email already exists",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return;
      }

      const user = await createUser({
        username,
        email,
        passwordHash: btoa(password),
        settings: {
          theme: 'light',
          notificationSounds: true,
          defaultCategory: 'Personal'
        }
      });

      login(user);
      toast({
        title: "Account created!",
        description: "Welcome to SmartToDo+!",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-xl md:text-2xl font-bold text-white">Create account</h2>
          <p className="text-white/80 text-sm md:text-base">
            Get started with SmartToDo+
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white text-sm md:text-base">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm md:text-base">Email</Label>
            <Input
              id="email"
              type="email"
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white text-sm md:text-base">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 transition-all duration-300"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all duration-300 text-sm md:text-base py-2 md:py-3" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        
        <div className="text-center text-sm md:text-base">
          <span className="text-white/80">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-white hover:text-white/80 underline font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </motion.div>
  );
};
