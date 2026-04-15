import { useState } from "react";
import Popup from "../Popup";
import EditCategory from "../EditCategory";

type CategoryActionsProps = {
  id: string;
  handleDeleteCategory: (id: string) => void;
};

const CategoryActions = ({ id, handleDeleteCategory }: CategoryActionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="actions">
      <button onClick={() => setOpen(true)}>Edit</button>

      <button onClick={() => handleDeleteCategory(id)}>
        Delete
      </button>

      <Popup trigger={open} setTrigger={setOpen}>
        <EditCategory id={id} />
      </Popup>
    </div>
  );
};

export default CategoryActions;