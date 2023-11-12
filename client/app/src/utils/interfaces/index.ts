export interface TasksProps {
  tasks: any[];
  getStatusColor: (status: string) => string;
  handleTaskClick: (task: any) => void;
  selectedTasks?: any;
}
