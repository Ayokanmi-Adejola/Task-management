
import React, { forwardRef } from 'react';
import { Task } from '@/types/kanban';
import { cn } from "@/lib/utils";
import { MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  dragging?: boolean;
  className?: string;
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onDelete, dragging, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "task-card p-4 rounded-lg bg-white shadow-task hover:shadow-task-hover",
          "border border-border/30 select-none cursor-grab touch-manipulation",
          "transition-all duration-200 ease-out",
          dragging && "task-dragging",
          className
        )}
        onClick={() => onEdit(task)}
        {...props}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full -mt-1 -mr-1 text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
            <span className="sr-only">Options</span>
          </Button>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.tags.map((tag) => (
              <Badge key={tag} variant={tag === 'Design' ? 'default' : tag === 'UI/UX' ? 'secondary' : 'outline'} 
                className={cn(
                  tag === 'Design' && "bg-pink-100 text-pink-800 hover:bg-pink-200",
                  tag === 'UI/UX' && "bg-purple-100 text-purple-800 hover:bg-purple-200",
                  tag === 'Dev' && "bg-green-100 text-green-800 hover:bg-green-200",
                  tag === 'Testing' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                )}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee}`} alt={assignee} />
                  <AvatarFallback>{assignee.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            {task.comments && (
              <div className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments && (
              <div className="flex items-center gap-1 text-xs">
                <Paperclip className="h-3.5 w-3.5" />
                <span>{task.attachments}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="text-xs font-medium">
                {task.dueDate}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
