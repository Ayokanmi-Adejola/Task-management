
import React, { forwardRef } from 'react';
import { Task } from '@/types/kanban';
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          "task-card p-3 rounded-lg bg-kanban-task shadow-task hover:shadow-task-hover",
          "border border-border/30 select-none cursor-grab touch-manipulation",
          "transition-all duration-200 ease-out",
          dragging && "task-dragging",
          className
        )}
        {...props}
      >
        <div className="mb-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h3>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
            {task.description}
          </p>
        )}
        
        <div className="flex justify-end gap-1 mt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-destructive opacity-50 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
