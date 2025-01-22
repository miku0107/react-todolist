import React, { useState, useEffect, useRef } from "react";
import { Task } from "../../../types/task";
import "./editTask.css"

interface EditTaskProps {
  editingTask: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

function EditTask({ editingTask, onSave, onCancel }: EditTaskProps) {
  const [task, setTask] = useState<Task>(editingTask);
  const modalRef = useRef<HTMLDivElement | null>(null);


  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSave = () => {
    onSave(task)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
      document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      }
  }, [onCancel])

  return (
    <>
      {/* 編集モーダル */}
        <div className="taskedit-modal">
          <div className="taskedit-modal-content" ref={modalRef}>
            <h4>タスクを編集</h4>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={onChange}
                placeholder="タイトル"
                className="edit-input title"
              />
              <textarea
                name="detail"
                value={task.detail}
                onChange={onChange}
                placeholder="詳細"
                className="edit-input edit-detail"
              />
              <input
                type="date"
                name="deadline"
                value={task.deadline}
                onChange={onChange}
                className="edit-input"
              />
            <div className="modal-buttons">
              <button onClick={onCancel}>キャンセル</button>
              <button onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
    </>

  )
}

export default EditTask;
