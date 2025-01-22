import React, { useEffect, useRef, useState } from "react";
import './newList.css';
import { List } from "../../../types/list";

interface NewListsProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createList: (title: string, taskId: number | undefined) => Promise<List | undefined>;
  taskId?: number;
}

function NewList({createList, isModalOpen, setIsModalOpen, taskId}: NewListsProps) {
  const [title, setTitle] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeCreateModal = () => {
    setTitle('');
    setIsModalOpen(false);
  }

  const handleCreateList = async () => {
    try {
      if (title.trim()) {
        await createList(title.trim(), taskId);
        closeCreateModal();
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeCreateModal();
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isModalOpen])

  return (
      <div className="sidebar-modal">
        <div className="create-list-modal" ref={modalRef}>
          <h4>新しいリストを作成</h4>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新しいリストの名前を入力してください"
          />
          <br/>
          <button onClick={closeCreateModal}>キャンセル</button>
          <button onClick={handleCreateList} disabled={!title.trim()}>作成</button>
        </div>
      </div>
  )
}

export default NewList;
