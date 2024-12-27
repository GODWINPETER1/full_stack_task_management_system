// src/redux/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface TaskDependency {
  id: number;
  task_id: number;
  dependent_task_id: number
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  due_date: string | null; // Add due_date to the interface
  priority: string;
}

interface TaskState {
  tasks: Task[];
  dependencies: TaskDependency[];
}

const initialState: TaskState = {
  tasks: [],
  dependencies: []
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    setDependencies(state , action: PayloadAction<TaskDependency[]>) {
      state.dependencies = action.payload
    },
    addDependency(state , action: PayloadAction<TaskDependency>) {
      state.dependencies.push(action.payload);
    },
    removeDependency(state , action: PayloadAction<number>) {
      state.dependencies = state.dependencies.filter(
        (d) => d.id !== action.payload
      )
    }
  },
});

export const { addTask, updateTask, deleteTask, setTasks , setDependencies , addDependency , removeDependency } = taskSlice.actions;
export default taskSlice.reducer;
