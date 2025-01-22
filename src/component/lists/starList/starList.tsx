import React, {useState} from "react";
import { Task } from "../../../types/task";
import { List } from "../../../types/list";
import TaskMenu from "../../tasks/taskMenu/taskMenu";
import EditTask from "../../tasks/editTask/editTask";
import './starList.css';
import NewTask from "../../tasks/newTask/newTask";
import { Tooltip } from "react-tooltip";

interface StarListProps {
  tasks: Task[];
  checkboxTaskCompletion: (taskId: number) => void;
  switchStar: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  onMove: (taskId: number, tasklistId: number) => void;
  createList: (title: string) => Promise<List>;
  lists: List[];
  selectedListId: number;
  newListShowFlag: (listId: number) => void;
  updateTask: (updateTask: Task) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
}

function StarList({tasks, checkboxTaskCompletion, switchStar, deleteTask, onMove, createList, lists, selectedListId, newListShowFlag, updateTask, addTask}: StarListProps) {
  const starTask = tasks.filter(task => task.star && !task.done);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleMenuOpen = (taskId: number) => {
    console.log("task menu open")
    setSelectedTaskId(taskId);
    setIsTaskMenuOpen(true);
  }

  const handleMenuClose = () => {
    setIsTaskMenuOpen(false);
    setSelectedTaskId(null);
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSave = (editingTask: Task) => {
    if (editingTask) {
      updateTask(editingTask);
      setEditingTask(null);
    }
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };


  const handleTaskEdit = () => {
    if (selectedTaskId !== null) {
      const task = tasks.find(task => task.id === selectedTaskId);
      if (task) handleEditClick(task);
      handleMenuClose();
    }
  }

  const handleTaskDelete = () => {
    if (selectedTaskId !== null) {
      deleteTask(selectedTaskId);
      handleMenuClose();
    }
  }


  if (starTask.length === 0) {
    return (
      <section className="starlist-index">
        <h4>スター付きのタスク</h4>
        <NewTask
          tasklistId={selectedListId}
          addTask={(task) => addTask({ ...task, star: true })}
          initialStar={true}
        />
        <div className="no-star-comment">
          <img src="https://www.gstatic.com/tasks/nothing-starred-light.svg" alt=" "/>
          <h5>スター付きのタスクはありません</h5>
          <p>重要なタスクにスターをつけて、ここでまとめて確認できます</p>
        </div>
      </section>
    )
  }
  return (
    <section className="starlist-index">
      <div>
      <h4>スター付きのタスク</h4>

        <NewTask
          tasklistId={selectedListId}
          addTask={(task) => addTask({ ...task, star: true })}
          initialStar={true}
        />

        {editingTask && (
          <EditTask
            editingTask={editingTask}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}

      <ul className="star-list">
        {starTask.map(task => (
          <li key={task.id} className="task">
            <div className="task-left-box">
              <div className="done-switch-box">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => checkboxTaskCompletion(task.id)}
                />
              </div>
              <div className="task-detail-box">
                <h3>{task.title}</h3>
                <p style={{ color: "gray", fontSize: "15px" }}>{task.detail}</p>
              </div>
            </div>

            <div className="task-menu">
              <div className="task-edit-delete">
                <button
                  onClick={() => handleMenuOpen(task.id)}
                  className="task-menu-btn"
                  data-tooltip-id="star-task-menu"
                >
                  <Tooltip
                    id="star-task-menu"
                    content="タスクのオプション"
                    place="bottom"
                  />
                  <i className="fa-solid fa-ellipsis-vertical icon" style={{ cursor: 'pointer' }} />
                </button>
              </div>
              {isTaskMenuOpen && selectedTaskId === task.id && (
                <div className="task-modal">
                  <TaskMenu
                    taskId={selectedTaskId}
                    onDelete={handleTaskDelete}
                    onEdit={handleTaskEdit}
                    onClose={handleMenuClose}
                    onMove={onMove}
                    createList={createList}
                    lists={lists}
                    currentListId={selectedListId}
                    newListShowFlag={newListShowFlag}
                  />
                </div>
              )}

              <p
                className="star task-menu-btn"
                onClick={() => switchStar(task.id)}
                style={{ cursor: 'pointer', color: task.star ? 'blue' : 'grey' }}
                data-tooltip-id="star"
              >
                <Tooltip
                  id="star"
                  content="[スター付き]から削除"
                  place="bottom"
                />
                {task.star ? '★' : '☆'}
              </p>
            </div>
          </li>
        ))}
        </ul>
      </div>
    </section>
)
}

export default StarList;
