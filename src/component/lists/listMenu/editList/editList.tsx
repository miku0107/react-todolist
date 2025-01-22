import React, { useEffect, useRef, useState } from "react";
import { editListAPI } from "../../../../api/listAPI";

interface EditListProps {
  listId: number;
  currentTitle: string;
  onClose: () => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
}

function EditListModal({ listId, currentTitle, onClose, onUpdateTitle }: EditListProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  })

  const handleListTitleUpdate = async () => {
    try {
      await editListAPI(listId, newTitle);
      onUpdateTitle(listId, newTitle);
      onClose();
    } catch (error) {
      console.error("Error updating list title:", error);
    }
  }
  return (
        <div className="modal-overlay">
          <div className="edit-list-modal" ref={modalRef}>
            <h4>リストの名前を変更</h4>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="タイトルを入力してください"
            />
            <br />
            <button onClick={onClose}>キャンセル</button>
            <button onClick={handleListTitleUpdate} disabled={!newTitle.trim}>完了</button>
          </div>
        </div>
  )
}

export default EditListModal;
