import React, { useEffect, useRef, useState } from "react";
import { List } from '../../types/list';
import { Task } from '../../types/task';
import NewTask from "../tasks/newTask/newTask";
import Tasks from '../tasks/task';
import './list.css';
import EditListModal from "./listMenu/editList/editList";
import ListMenu from "./listMenu/listMenu";
import { deleteListAPI } from "../../api/listAPI";
import { Tooltip } from "react-tooltip";

interface ListProps {
  selectedListId: number;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  setSelectedListId: React.Dispatch<React.SetStateAction<number>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  checkboxTaskCompletion: (taskId: number) => void;
  switchStar: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (updateTask: Task) => void;
  newListShowFlag: (listId: number) => void;
  createList: (title: string) => Promise<List>;
  onMove: (taskId: number, tasklistId: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
}

function Lists({
  selectedListId, lists, setLists, setSelectedListId, tasks, setTasks,
  checkboxTaskCompletion, switchStar, deleteTask, updateTask, newListShowFlag, createList, onMove, addTask
}: ListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleDialog = () => {
    console.log("list menu open test")
    setIsDialogOpen(prevState => !prevState);
  }

  const openEditModal = () => {
    setIsDialogOpen(false);
    setIsEditModalOpen(true);
  }
  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current &&
        !dialogRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.icon')
      ) {
        setIsDialogOpen(false);
      }
    }
    if (isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDialogOpen]);

  const updateList = (id: number, newTitle: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === id ? { ...list, title: newTitle } : list
      )
    )
  }

  const deleteList = async (id: number) => {
    try {
      if (id === 1) {
        console.error("Default listing can't be deleted!");
        return
      }
      await deleteListAPI(id);
      setLists(prevLists => prevLists.filter(list => list.id !== id));
      if (selectedListId === id) {
      }
    } catch (error) {
      console.error("Error deleting the list:", error);
    }
  }

  const currentList = lists.find(list => list.id === selectedListId);
  const listTitle = currentList?.title || "";

  const filteredTasks = selectedListId
    ? tasks
      .filter(task => task.tasklistId === selectedListId)
    : [];

  return (
    <section className="list-index">
        <div className="list-headline">
          <h4>{currentList?.title}</h4>
          <button className="list-modal-button" data-tooltip-id="list-menu" onClick={toggleDialog}>
            <Tooltip
              id="list-menu"
              content="リストのオプション"
              place="bottom"
            />
            <i className="fa-solid fa-ellipsis-vertical icon" />
          </button>

          {isDialogOpen && (
            <div className="modal" ref={dialogRef}>
              <ListMenu
                listId={selectedListId}
                onDelete={deleteList}
                onOpenEditModal={openEditModal}
              />
            </div>
          )}
          {isEditModalOpen && (
            <EditListModal
              listId={selectedListId}
              currentTitle={listTitle}
              onClose={closeEditModal}
              onUpdateTitle={updateList}
            />
          )}
        </div>

      <NewTask
        tasklistId={selectedListId}
        addTask={addTask}
        initialStar={false}
      />
      <Tasks
        tasks={filteredTasks}
        setTasks={setTasks}
        checkboxTaskCompletion={checkboxTaskCompletion}
        switchStar={switchStar}
        deleteTask={deleteTask}
        updateTask={updateTask}
        lists={lists}
        setLists={setLists}
        selectedListId={selectedListId}
        setSelectedListId={setSelectedListId}
        newListShowFlag={newListShowFlag}
        createList={createList}
        onMove={onMove}
      />
    </section>
  );
};

export default Lists;
