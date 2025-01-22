import React, { useState } from "react";
import { addTaskAPI } from "../../../api/taskAPI";
import { Task } from "../../../types/task";
import './newTask.css';

interface NewTaskProps {
  tasklistId: number;
  addTask: (task: Omit<Task, 'id'>) => void;
  initialStar: boolean;
}

function NewTask({ tasklistId, addTask, initialStar }: NewTaskProps) {
  const [task, setTask] = useState<Omit<Task, 'id'>>({
    title: '',
    detail: '',
    deadline: '',
    tasklistId: tasklistId,
    done: false,
    star: false,
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTask = {
        ...task,
        tasklistId: tasklistId,
        done: false,
        star: initialStar
      }
      const addedTask = await addTaskAPI(newTask);
      addTask(addedTask);
      setTask({
        title: '',
        detail: '',
        deadline: '',
        tasklistId: tasklistId,
        done: false,
        star: false,
      });
    } catch (error) {
      console.error("Error submitting the task:", error);
    }
  };

  return (
    <div>
      <button
        className="new-btn"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <i className="fa-regular fa-circle-check" />
        {initialStar ? 'スター付きのタスクを追加する' : 'タスクを追加する'}
      </button>

      {isFormVisible && (
          <form className="new-task-form" onSubmit={createTask}>
            <div className="task-title form">
              <input
                className="form-area"
                name="title"
                value={task.title}
                onChange={handleChange}
                placeholder="タイトル"
              />
            </div>
            <div className="detail">
              <div className="task-detail form">
                <textarea
                  className="form-area"
                  name="detail"
                  value={task.detail}
                  onChange={handleChange}
                  placeholder="詳細"
                />
              </div>
              <div className="task-deadline form">
                <input
                  className="form-area"
                  type="date"
                  name="deadline"
                  value={task.deadline}
                  onChange={handleChange}
                  placeholder="日時"
                />
              </div>
              <div className="submit-btn">
                <button className="submit-button" type="submit" disabled={!task.title}>タスク追加</button>
              </div>
            </div>
          </form>
        )
      }
    </div>
  )
}

export default NewTask;
