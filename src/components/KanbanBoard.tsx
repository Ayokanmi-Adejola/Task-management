
import React, { useState, useEffect } from 'react';
import { Task, Column, TaskStatus } from '@/types/kanban';
import { getTasksFromLocalStorage, saveTasksToLocalStorage } from '@/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import TaskCard from './TaskCard';
import ColumnHeader from './ColumnHeader';
import CreateTaskDialog from './CreateTaskDialog';
import EditTaskDialog from './EditTaskDialog';
import { toast } from 'sonner';

const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggingOver, setDraggingOver] = useState<TaskStatus | null>(null);

  useEffect(() => {
    const savedTasks = getTasksFromLocalStorage();
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  const handleCreateTask = (title: string, description: string, status: TaskStatus) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status,
      createdAt: Date.now(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggingOver(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggingOver(status);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    
    if (draggedTask) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === draggedTask) {
          return { ...task, status };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      setDraggedTask(null);
      setDraggingOver(null);
    }
  };

  const getColumnTasks = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {COLUMNS.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          
          return (
            <div 
              key={column.id}
              className="flex-1 min-w-[280px] flex flex-col max-h-full"
            >
              <ColumnHeader 
                title={column.title} 
                count={columnTasks.length} 
                status={column.id} 
              />
              
              <div
                className={`flex-1 p-2 rounded-lg bg-kanban-column-bg overflow-y-auto flex flex-col gap-2 ${
                  draggingOver === column.id ? 'column-drop-active' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <TaskCard
                      task={task}
                      dragging={draggedTask === task.id}
                      onEdit={(task) => {
                        setEditingTask(task);
                        setEditDialogOpen(true);
                      }}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-xs text-muted-foreground italic">
                      Drop tasks here
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <CreateTaskDialog
                  status={column.id}
                  onCreate={handleCreateTask}
                />
              </div>
            </div>
          );
        })}
      </div>

      <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default KanbanBoard;
