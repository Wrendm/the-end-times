import { useState } from "react";
import Popup from "../Popup";
import EditPost from "../EditPost";

type PostActionsProps = {
  id: string;
  handleDeletePost: (id: string) => void;
};

const PostActions = ({ id, handleDeletePost }: PostActionsProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="actions">
      <button onClick={() => setOpen(true)}>Edit</button>
      <button onClick={() => handleDeletePost(id)}>Delete</button>
            <Popup trigger={open} setTrigger={setOpen}>
        <EditPost id={id} />
      </Popup>
    </div>
  );
};

export default PostActions;