import { useState } from "react";
import Popup from "../../ui/Popup";
import EditCategory from "../../features/categories/EditCategory";

type CategoryActionsProps = {
  id: string;
  handleDeleteCategory: (id: string) => void;
};

const CategoryActions = ({ id, handleDeleteCategory }: CategoryActionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="actions ButtonRow">
      <button className="admin-btn" onClick={() => setOpen(true)}>Edit</button>
      <button className="admin-btn" onClick={() => handleDeleteCategory(id)}>
        Delete
      </button>

      <Popup trigger={open} setTrigger={setOpen}>
        <EditCategory id={id} />
      </Popup>
    </div>
  );
};

export default CategoryActions;