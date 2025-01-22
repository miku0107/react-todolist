import React from "react";
import './listMenu.css';

interface ListMenuProps {
  listId: number;
  onDelete: (id: number) => void;
  onOpenEditModal: () => void;
}

function ListMenu({ listId, onDelete, onOpenEditModal }: ListMenuProps) {

  return (
    <div className="listmenu-content">
      <button
        style={{ cursor: 'pointer' }}
        onClick={onOpenEditModal}
      >
        リストタイトルを変更
      </button>
      <button
        onClick={() => listId !== null && onDelete(listId)}
        style={{ cursor: 'pointer', textAlign: "left" }}
        disabled={listId === 1}
      >
        {listId === 1 ? (
          <span className="delete-btn">
            リストを削除<br />
            <span className="no-delete">デフォルトのリストは削除できません</span>
          </span>
        ) : (
          "リストを削除"
        )}
      </button>
    </div>
  )
}

export default ListMenu;
