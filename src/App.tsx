import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { createListAPI } from './api/listAPI';
import { deleteTaskAPI, doneTaskAPI, fetchTasksAPI, starTaskAPI, changeListAPI, updateTaskAPI } from './api/taskAPI';
import Lists from './component/lists/list';
import StarList from './component/lists/starList/starList';
import SideBar from './component/sideBar/sideBar';
import { List } from './types/list';
import { Task } from './types/task';
import { fetchListsAPI } from './api/listAPI';
import { title } from 'process';

function App() {
  //　⬇︎リストコンポーネント制御
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<number>(1);
  const [listShowFlag, setListShowFlag] = useState<Record<number, boolean>>({});
  const [isStarListView, setIsStarListView] = useState<boolean>(false);


  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetchListsAPI();
        setLists(response);
        const defaltShowFlag: Record<number, boolean> = {};
        response.forEach((list: List) => {
          defaltShowFlag[list.id] = true;
        });
        setListShowFlag(defaltShowFlag);
      } catch (error) {
        console.error('Error in fetchLists:', error);
      }
    }
    fetchLists();
  }, []);

  const moveTask = async (taskId: number, tasklistId: number) => {
    try {
      await changeListAPI(taskId, tasklistId);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, tasklistId: tasklistId } : task
        ))
      setSelectedListId(tasklistId);
    } catch (error) {
      console.error("Failed to move task:", error)
    }
  }

  const createList = async (title: string) => {
    try {
      const newList = await createListAPI(title);
      setLists(prevLists => [...prevLists, newList]);
      setListShowFlag(prevShowFlag => ({
        ...prevShowFlag,
        [newList.id]: true,
      }));
      return newList;
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  }

  const hanldeCheckboxChange = (listId: number) => {
    setListShowFlag(prevShowFlag => ({
      ...prevShowFlag,
      [listId]: !prevShowFlag[listId]
    }))
  }

  const newListShowflg = (newListId: number) => {
    setListShowFlag((prevShowFlg) => ({
      ...prevShowFlg,
      [newListId]: true,
    }))
  }

  //タスク ///////////////////////////////////////
  const [tasks, setTasks] = useState<Task[]>([]);

  //タスク 編集
  useEffect(() => {
    const fetchAndSetTasks = async () => {
      try {
        const tasks = await fetchTasksAPI();
        setTasks(tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }
    fetchAndSetTasks();
  }, []);

  //タスク 完了切り替え
  const checkboxTaskCompletion = async (taskId: number) => {
    try {
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        console.error("Task not found");
        return;
      }
      await doneTaskAPI(taskId, !currentTask.done);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, done: !task.done } : task
      ));
    } catch (error) {
      console.error("Error task completed", error);
    }
  };

  //タスク スター切り替え
  const switchStar = async (taskId: number) => {
    try {
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        console.error("Task not found");
        return;
      }
      await starTaskAPI(taskId, !currentTask.star);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, star: !task.star } : task
        )
      )
    } catch (error) {
      console.error("Error switching star:", error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const updatedTaskFromAPI = await updateTaskAPI(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskFromAPI.id ? updatedTaskFromAPI : task
        )
      );
    } catch (error) {
      console.error("タスク更新に失敗しました:", error);
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      await deleteTaskAPI(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting the task:", error);
    }
  }

  const [nextId, setNextId] = useState<number>(1);

  const addTask = (newTask: Omit<Task, 'id'>) => {
    setTasks(prevTasks => [
      ...prevTasks,
      { ...newTask, id: nextId }
    ]);
    setNextId(prevId => prevId + 1);
  };

  return (
    <div className="App">
      {/**サイドバー */}
      <SideBar
        lists={lists}
        listShowFlag={listShowFlag}
        onCheckboxChange={hanldeCheckboxChange}
        createList={createList}
        onStarListView={() => setIsStarListView(true)}
        onAllListView={() => setIsStarListView(false)}
        isStarListView={isStarListView}
      />

      {isStarListView ? (
        // スター付きのタスク
        <StarList
          tasks={tasks}
          checkboxTaskCompletion={checkboxTaskCompletion}
          switchStar={switchStar}
          deleteTask={deleteTask}
          onMove={moveTask}
          createList={createList}
          lists={lists}
          selectedListId={selectedListId}
          newListShowFlag={newListShowflg}
          updateTask={updateTask}
          addTask={addTask}
        />
      ) : (
        // すべてのタスク
        <div className='list-box'>
          {Object.values(listShowFlag).some((isShowFlg) => isShowFlg) ? (
            lists.map(list => (
              listShowFlag[list.id] && (
                  <Lists
                    key={list.id}
                    selectedListId={list.id}
                    lists={lists}
                    setLists={setLists}
                    setSelectedListId={setSelectedListId}
                    newListShowFlag={newListShowflg}
                    tasks={tasks}
                    setTasks={setTasks}
                    checkboxTaskCompletion={checkboxTaskCompletion}
                    switchStar={switchStar}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    createList={createList}
                    onMove={moveTask}
                    addTask={addTask}
                  />
              )))
          ) : (
            <div className='no-show-list'>
              <img src='https://www.gstatic.com/tasks/all-task-lists-hidden.svg' alt='' />
              <p className='list-hide-title'>すべてのリストが非表示になっています</p>
              <p className='list-hide-text'>タスクを表示するには、いずれかのリストを選択してください</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
