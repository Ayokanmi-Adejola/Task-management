
import React from 'react';
import { cn } from "@/lib/utils";
import { TaskStatus } from '@/types/kanban';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColumnHeaderProps {
  title: string;
  count: number;
  status: TaskStatus;
  color: string;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count, status, color }) => {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <h3 className="font-medium text-sm tracking-wide">
          {title} ({count})
        </h3>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More options</span>
      </Button>
    </div>
  );
};

export default ColumnHeader;
