import React, { useState } from "react";
import NewList from "../lists/newList/newList";
import './sideBar.css';

interface List {
  id: number;
  title: string;
}

interface SideBarProps {
  lists: List[];
  listShowFlag: Record<number, boolean>;
  onCheckboxChange: (listId: number) => void;
  createList: (title: string) => Promise<List>;
  onStarListView: () => void;
  onAllListView: () => void;
  isStarListView: boolean;
}

function SideBar({ lists, listShowFlag, onCheckboxChange, createList, onStarListView, onAllListView, isStarListView }: SideBarProps){
  const [isListShowflg, setIsListShowflg] = useState(true);
  const [selectedButton, setSelectedButton] = useState<"all" | "star">("all");
  const [isModalFromSidebarOpen, setIsModalFromSidebarOpen] = useState(false);

  const toggleListShowflg = () => setIsListShowflg(prev => !prev);

  const openCreateList = () => {
    setIsModalFromSidebarOpen(true);
  }

  const handleCreateList = async (title: string) => {
    try {
      const newList =  await createList(title);
      return newList;
    } catch (error) {
      console.error("Error creating list in SideBar:", error);
    }
  };

  return (
    <div className="side-bar">
      <ul>
        <div className="list-switch">
          <button
            onClick={() => {
              setSelectedButton("all");
              onAllListView();
            }}
            className={selectedButton === "all" ? "active-button" : ""}
          >
            <i className="fa-regular fa-circle-check"></i>すべてのタスク
          </button>

          <button
            onClick={() => {
              setSelectedButton("star");
              onStarListView();
            }}
            className={selectedButton === "star" ? "active-button" : ""}
          >
            <i className={isStarListView ? "fa-solid fa-star" : "fa-regular fa-star"}></i>スター付きのタスク
          </button>
        </div>

        <div className="list-name-index">
          <p
            onClick={toggleListShowflg}
            style={{cursor: "pointer"}}
          >リスト
            <i className={`fa-solid ${isListShowflg ? "fa-angle-up" : "fa-angle-down"}`}></i>
          </p>
          {isListShowflg &&
            lists.map(list => (
            <div key={list.id}
              className="list-showflg-btn"
              onClick={() => onCheckboxChange(list.id)}
            >
              <input
                type="checkbox"
                checked={listShowFlag[list.id]}
                // onChange={() => onCheckboxChange(list.id)}
              />
              <label>{list.title}</label>
            </div>
          ))}
        </div>

        <p
          className="sidebar-newlist"
          onClick={openCreateList}
        >
          <i className="fa-solid fa-plus" />新しいリストを作成
        </p>
        { isModalFromSidebarOpen && (
          <NewList
            isModalOpen={isModalFromSidebarOpen}
            setIsModalOpen={setIsModalFromSidebarOpen}
            createList={handleCreateList}
          />
        )}
      </ul>
    </div>
  )
}

export default SideBar;
