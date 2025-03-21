
import React from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Search, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/70 px-6 py-3 sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded text-white">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Task Kanban</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full py-2 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <main className="flex-1 px-6 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <KanbanBoard />
        </div>
      </main>
      
      <footer className="mt-auto border-t border-border/70 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Designed with simplicity in mind
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
