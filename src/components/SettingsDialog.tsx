
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserSettings {
  autoSave: boolean;
  theme: string;
  notifications: boolean;
  emailNotifications: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  autoSave: true,
  theme: 'system',
  notifications: true,
  emailNotifications: false
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("account");
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const handleSaveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    toast.success('Profile updated successfully');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={logout}>
                  Log out
                </Button>
                <Button onClick={handleSaveProfile}>
                  Update Profile
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="pt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autosave">Auto-save Tasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save tasks when they're moved
                    </p>
                  </div>
                  <Switch 
                    id="autosave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, autoSave: checked }))
                    }
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about task updates
                    </p>
                  </div>
                  <Switch 
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, notifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your tasks
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
              </div>
              
              <Button className="mt-4 w-full" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
