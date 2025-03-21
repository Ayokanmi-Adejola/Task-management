
import React from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { cn } from '@/lib/utils';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/70 px-6 py-4 glass sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-medium tracking-tight">Kanban Board</h1>
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
