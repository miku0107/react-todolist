import { useEffect, useRef, useState } from "react";
import React from "react";
import "./taskMenu.css"
import { List } from "../../../types/list";
import NewList from "../../lists/newList/newList";
import { createListAPI } from "../../../api/listAPI";
import { title } from "process";

interface TaskMenuProps {
  taskId: number;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMove: (taskId: number, newListId: number) => void;
  lists: List[];
  currentListId: number;
  newListShowFlag: (listId: number) => void;
  createList: (title: string) => Promise<List>;
}

function TaskMenu({ taskId, onClose, onDelete, onEdit, onMove, lists, currentListId, newListShowFlag, createList }: TaskMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalFromTaskmenuOpen, setIsModalFromTaskmenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose])

  const openCreateList = () => {
    console.log("ここは動いてますか？？？？？？？＾＾；");
    setIsModalFromTaskmenuOpen(true);
    // onClose();
  }

  const createListFromTaskMenu = async(title: string, taskId: number ) => {
    try {
      console.log("こっち動いてないだろ")
      const newList = await createList(title);
      newListShowFlag(newList.id)
      await onMove(taskId, newList.id)
      onClose();
      return newList;
    } catch (error) {
      console.error("Error creating list and moving task:", error);
    }
  }


  return (
    <div className="task-menu-content" ref={menuRef}>
      <div className="task-control">
        <button onClick={onDelete}>
          <span className="icon-placeholder"><i className="fa-solid fa-trash-can"/></span>
          削除
        </button>

        <button onClick={onEdit}>
          <span className="icon-placeholder"><i className="fa-solid fa-pen" /></span>
          編集
        </button>
      </div>
      <div className="list-select-box">
        <div className="list-options">
          {lists.map((list) => (
            <button
              key={list.id}
              className="list-item"
              onClick={() => onMove(taskId, list.id)}
            >
              <span className="icon-placeholder">
              {currentListId === list.id && (
                <i className="fa-solid fa-check" />
                )}
              </span>
              {list.title}
            </button>
          ))}
        </div>

        <button onClick={openCreateList}>
          <span className="icon-placeholder"><i className="fa-solid fa-plus" /></span>
          新規リスト
        </button>

        {isModalFromTaskmenuOpen && (
          <NewList
            isModalOpen={isModalFromTaskmenuOpen}
            setIsModalOpen={setIsModalFromTaskmenuOpen}
            createList={(title: string) => {
              if (taskId !== undefined) {
                return createListFromTaskMenu(title, taskId);
              } else {
                console.error("Task ID is undefined.");
                return Promise.reject("Task ID is undefined.");
              }
            }}
            taskId={taskId}
          />
        )}
      </div>
    </div>
  )
}

export default TaskMenu;
