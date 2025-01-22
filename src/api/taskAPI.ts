import axios from "axios";
import { Task } from "../types/task";

const API_URL = "http://localhost:8080";

//タスク管理API

//タスク一覧取得（GET）
export const fetchTasksAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

//タスク投稿（POST）
export const addTaskAPI = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    const response = await axios.post(`${API_URL}/task`, task);
    return response.data;
  } catch (error) {
    console.error("Error posting task:", error);
    throw error;
  }
}

//タスク編集（PUT）
export const updateTaskAPI = async (updatedTask: Task) => {
  try {
    const response = await axios.put(`${API_URL}/task/${updatedTask.id}`, updatedTask);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

//タスク 完了切り替え
export const doneTaskAPI = async (taskId: number, done: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/switch/${taskId}`, { done });
    return response.data;
  } catch (error) {
    console.error("Error completion switch:", error)
  }
}

//タスク スター切り替え
export const starTaskAPI = async (taskId: number, star: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/star/${taskId}`, { star });
    return response.data;
  } catch (error) {
    console.error("Error star switch:", error);
  }
}

//タスク　リスト付け替え
export const changeListAPI = async (taskId: number, tasklistId: number) => {
  try {
    const response = await axios.put(`${API_URL}/change-list/${taskId}`, { tasklistId })
    return response.data;
  } catch (error) {
    console.error("Error change list:", error);
  }
}

//タスク 削除
export const deleteTaskAPI = async (taskId: number) => {
  try {
    await axios.delete(`${API_URL}/task/${taskId}`);
  } catch (error) {
    console.error("Error delete task:", error);
  }
}
