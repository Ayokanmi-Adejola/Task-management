
import React from 'react';
import { cn } from "@/lib/utils";
import { TaskStatus } from '@/types/kanban';

interface ColumnHeaderProps {
  title: string;
  count: number;
  status: TaskStatus;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count, status }) => {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-sm tracking-wide text-muted-foreground">
          {title}
        </h3>
        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-xs text-muted-foreground">{count}</span>
        </div>
      </div>
    </div>
  );
};

export default ColumnHeader;
