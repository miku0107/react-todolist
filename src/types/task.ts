export interface Task {
  id: number;
  title: string;
  detail: string;
  deadline: string;
  done: boolean;
  tasklistId: number;
  star: boolean;
}
