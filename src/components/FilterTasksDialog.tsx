
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TaskFilters {
  tags: string[];
  assignees: string[];
  showCompleted: boolean;
}

interface FilterTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: TaskFilters) => void;
  currentFilters: TaskFilters;
  availableTags: string[];
  availableAssignees: string[];
}

const FilterTasksDialog: React.FC<FilterTasksDialogProps> = ({ 
  open, 
  onOpenChange, 
  onApplyFilters, 
  currentFilters,
  availableTags,
  availableAssignees
}) => {
  const [filters, setFilters] = useState<TaskFilters>(currentFilters);
  const [activeTab, setActiveTab] = useState<string>("tags");
  
  const resetFilters = () => {
    setFilters({
      tags: [],
      assignees: [],
      showCompleted: true
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleAssignee = (assignee: string) => {
    setFilters(prev => ({
      ...prev,
      assignees: prev.assignees.includes(assignee)
        ? prev.assignees.filter(a => a !== assignee)
        : [...prev.assignees, assignee]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        
        <div className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tags">Filter by Tags</TabsTrigger>
              <TabsTrigger value="assignees">Filter by People</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tags" className="pt-4">
              <div className="space-y-4">
                {availableTags.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableTags.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag}`}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="cursor-pointer">{tag}</Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No tags available
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="assignees" className="pt-4">
              <div className="space-y-4">
                {availableAssignees.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableAssignees.map(assignee => (
                      <div key={assignee} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`assignee-${assignee}`}
                          checked={filters.assignees.includes(assignee)}
                          onCheckedChange={() => toggleAssignee(assignee)}
                        />
                        <Label htmlFor={`assignee-${assignee}`} className="cursor-pointer">{assignee}</Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No assignees available
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2 mt-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-completed"
                checked={filters.showCompleted}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, showCompleted: !!checked }))
                }
              />
              <Label htmlFor="show-completed" className="cursor-pointer">Show completed tasks</Label>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={resetFilters}
              className="gap-2"
            >
              <FilterX className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              type="button"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterTasksDialog;
