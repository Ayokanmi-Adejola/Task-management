
import React, { useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Search, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from '@/components/LoginDialog';
import RegisterDialog from '@/components/RegisterDialog';
import SettingsDialog from '@/components/SettingsDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLoginClick = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleRegisterClick = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };
  
  const handleNotificationClick = () => {
    toast('No new notifications', {
      description: 'You will be notified when there are updates.',
    });
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto rounded-full" aria-label="User profile">
                    <Avatar>
                      <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2" align="end">
                  <div className="px-1 py-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => setSettingsOpen(true)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive" onClick={logout}>
                        Log out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button variant="default" onClick={handleLoginClick}>
                Log in
              </Button>
            )}
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
          <div className="text-sm">
            {!isAuthenticated && (
              <span>
                <Button variant="link" className="p-0 h-auto" onClick={handleLoginClick}>
                  Log in
                </Button>
                {' '} or {' '}
                <Button variant="link" className="p-0 h-auto" onClick={handleRegisterClick}>
                  Register
                </Button>
                {' '} to save your tasks
              </span>
            )}
          </div>
        </div>
      </footer>
      
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
        onRegisterClick={handleRegisterClick} 
      />
      
      <RegisterDialog 
        open={registerOpen} 
        onOpenChange={setRegisterOpen}
        onLoginClick={handleLoginClick}
      />
      
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
};

export default Index;
