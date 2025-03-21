
import React, { useState, useEffect } from 'react';
import { Task, Column, TaskStatus } from '@/types/kanban';
import { getTasksFromLocalStorage, saveTasksToLocalStorage } from '@/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import TaskCard from './TaskCard';
import ColumnHeader from './ColumnHeader';
import CreateTaskDialog from './CreateTaskDialog';
import EditTaskDialog from './EditTaskDialog';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Filter, Plus } from 'lucide-react';

const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-400' },
  { id: 'doing', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'done', title: 'Completed', color: 'bg-green-500' },
];

const DEMO_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finish Requirements',
    description: 'Complete project requirements document',
    status: 'todo',
    createdAt: Date.now(),
    tags: ['Design'],
    assignees: ['user1', 'user2', 'user3'],
    comments: 5,
    attachments: 2
  },
  {
    id: '2',
    title: 'UI Design',
    description: 'Create UI design based on requirements',
    status: 'todo',
    createdAt: Date.now(),
    tags: ['UI/UX'],
    assignees: ['user1'],
    comments: 3
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Integrate with backend APIs',
    status: 'todo',
    createdAt: Date.now(),
    assignees: ['user1']
  },
  {
    id: '4',
    title: 'Landing Page Design',
    description: 'Create design for landing page',
    status: 'doing',
    createdAt: Date.now(),
    dueDate: '12/20',
    tags: ['UI/UX'],
    assignees: ['user1', 'user2'],
    comments: 7
  },
  {
    id: '5',
    title: 'Usability Testing',
    description: 'Conduct usability testing sessions',
    status: 'doing',
    createdAt: Date.now(),
    tags: ['Testing'],
    assignees: ['user2'],
    comments: 4,
    attachments: 3
  },
  {
    id: '6',
    title: 'Feature Development',
    description: 'Implement new feature based on design',
    status: 'doing',
    createdAt: Date.now(),
    assignees: ['user1']
  },
  {
    id: '7',
    title: 'Setup Development',
    description: 'Set up development environment',
    status: 'done',
    createdAt: Date.now(),
    tags: ['Dev'],
    assignees: ['user3'],
    comments: 1
  },
  {
    id: '8',
    title: 'User Flow Diagrams',
    description: 'Create user flow diagrams',
    status: 'done',
    createdAt: Date.now(),
    tags: ['UI/UX'],
    assignees: ['user1', 'user2'],
    comments: 3
  },
  {
    id: '9',
    title: 'Data Model Design',
    description: 'Design database schema',
    status: 'done',
    createdAt: Date.now(),
    assignees: ['user3']
  }
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggingOver, setDraggingOver] = useState<TaskStatus | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createInColumn, setCreateInColumn] = useState<TaskStatus>('todo');

  useEffect(() => {
    let savedTasks = getTasksFromLocalStorage();
    if (savedTasks.length === 0) {
      // If no tasks found, use demo tasks
      savedTasks = DEMO_TASKS;
      saveTasksToLocalStorage(savedTasks);
    }
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  const handleCreateTask = (title: string, description: string, status: TaskStatus, tags?: string[]) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status,
      createdAt: Date.now(),
      tags
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

  const openCreateTaskDialog = (status: TaskStatus) => {
    setCreateInColumn(status);
    setCreateTaskOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground text-sm">View and manage your tasks</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter Tasks
          </Button>
          <Button 
            onClick={() => {
              setCreateInColumn('todo');
              setCreateTaskOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>
      
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
                color={column.color}
              />
              
              <div
                className={`flex-1 p-2 rounded-lg bg-gray-50 overflow-y-auto flex flex-col gap-2 ${
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
                <Button 
                  variant="ghost" 
                  className="w-full h-9 gap-1 text-muted-foreground hover:text-foreground group transition-all flex items-center justify-center"
                  onClick={() => openCreateTaskDialog(column.id)}
                >
                  <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Add Task</span>
                </Button>
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
      
      <CreateTaskDialog
        status={createInColumn}
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onCreate={handleCreateTask}
      />
    </div>
  );
};

export default KanbanBoard;
