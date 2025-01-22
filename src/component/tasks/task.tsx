import React, { useState } from "react";
import './task.css';
import { Task } from '../../types/task';
import EditTask from "./editTask/editTask";
import TaskMenu from "./taskMenu/taskMenu";
import { List } from "../../types/list";
import { changeListAPI } from "../../api/taskAPI";
import { Tooltip } from "react-tooltip";

interface TasksComponentProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  checkboxTaskCompletion: (taskId: number) => void;
  switchStar: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (updateTask: Task) => void;
  selectedListId: number;
  setSelectedListId: React.Dispatch<React.SetStateAction<number>>;
  newListShowFlag: (listId: number) => void;
  createList: (title: string) => Promise<List>;
  onMove: (taskId: number, tasklistId: number) => void;
}

function Tasks({
  tasks, lists, setTasks, checkboxTaskCompletion, switchStar, deleteTask, updateTask, selectedListId, setSelectedListId, newListShowFlag, createList, onMove
}: TasksComponentProps) {
  const [searchKeyword, setSearchKeyword] = useState(``);
  const [searchResult, setSearchResult] = useState<Task[]>(tasks);
  const [showFlg, setShowFlg] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setSearchResult(filteredTasks);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const hasTasks = tasks.length > 0;
  const hasSearchTasks = filteredTasks.length > 0;
  const allCompleted = hasTasks && tasks.every(task => task.done);

  const toggleShowFlg = () => {
    setShowFlg(prev => !prev);
  };

  const compareWeek = (deadline: string) => {
    const today = new Date();
    const taskDeadline = new Date(deadline);

    if (isNaN(taskDeadline.getTime())) {
      return ``;
    }

    today.setHours(0, 0, 0, 0);
    taskDeadline.setHours(0, 0, 0, 0);

    const diffTime = taskDeadline.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let text = "";
    let color = "";

    if (diffDays > 1) {
      text = `${taskDeadline.toLocaleDateString()}`;
      color = "gray"
    } else if (diffDays === 1) {
      text = `明日`;
      color = "gray"
    } else if (diffDays === 0) {
      text = `今日`;
      color = "blue"
    } else if (diffDays === -1) {
      text = `昨日`;
      color = "red"
    } else {
      text = `${Math.abs(diffDays)}日前`;
      color = "red"
    }
    return <span style={{color}}>{ text }</span>
  }

  //task編集モーダル管理

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

  // menuダイアログ管理

  const handleMenuOpen = (taskId: number) => {
    console.log("task menu open")
    setSelectedTaskId(taskId);
    setIsTaskMenuOpen(true);
  }

  const handleMenuClose = () => {
    setIsTaskMenuOpen(false);
    setSelectedTaskId(null);
  }

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

  return (
    <>
      {/**タスク編集モーダル */}
      {editingTask && (
        <EditTask
          editingTask={editingTask}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}

      <section className="menu-bar">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="タスク名で検索"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <button type="submit">検索</button>
        </form>
      </section>

      <div className="tasks">
        {allCompleted ? (
          <div>
            <img src="https://www.gstatic.com/tasks/all-tasks-completed-light.svg" alt="all tasks completed" />
            <p>タスクがすべて完了しました！</p>
          </div>
        ) : null}

        {!hasTasks ? (
          <div>
            <img src="https://www.gstatic.com/tasks/empty-tasks-light.svg" alt="no tasks" />
            <p>まだタスクは追加されていません</p>
          </div>
        ) : !hasSearchTasks ? (
            <div>
              <img src="https://www.gstatic.com/tasks/all-task-lists-hidden.svg" alt=""/>
            <p>検索に一致するタスクが見つかりません</p>
            </div>
        ) : (
          <div>
            <ul className="no-complete-tasks task-box">
              {filteredTasks.filter(task => !task.done).map(task => (
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
                      <p className="deadline">{compareWeek(task.deadline)}</p>
                    </div>
                  </div>

                  <div className="task-menu">
                    <div className="task-edit-delete">
                      <button
                        onClick={() => handleMenuOpen(task.id)}
                        className="task-menu-btn"
                        data-tooltip-id="task-menu"
                      >
                        <Tooltip
                          id="task-menu"
                          content="タスクのオプション"
                          place="bottom"
                        />
                        <i className="fa-solid fa-ellipsis-vertical icon" style={{ cursor: 'pointer' }}/>
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
                      data-tooltip-id={`star-tooltip-${task.id}`}
                    >
                      <Tooltip
                        id={`star-tooltip-${task.id}`}
                        content={task.star ? "[スター付き]から削除" : "[スター付き]に追加"}
                        place="bottom"
                      />
                      {task.star ? '★' : '☆'}
                  </p>
                  </div>
                </li>
              ))}
            </ul>

            {filteredTasks.filter(task => task.done).length > 0 && (
            <ul className="complete-tasks">
              <p onClick={toggleShowFlg} style={{ cursor: 'pointer', textAlign: 'left' }}>
                {showFlg ? '▼' : '▶︎'}完了（{filteredTasks.filter(task => task.done).length}件）
              </p>
              {showFlg && filteredTasks.filter(task => task.done).map(task => (
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
                      <p className="deadline">{compareWeek(task.deadline)}</p>
                    </div>
                  </div>

                  <div className="task-menu">
                    <div className="task-edit-delete">
                      <button className="delete-btn" onClick={() => deleteTask(task.id)}><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Tasks;
