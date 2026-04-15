import { useState } from "react";
import Popup from "../../ui/Popup";
import EditPost from "../../features/posts/EditPost";

type PostActionsProps = {
  id: string;
  handleDeletePost: (id: string) => void;
};

const PostActions = ({ id, handleDeletePost }: PostActionsProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="actions ButtonRow">
      <button className="admin-btn" onClick={() => setOpen(true)}>Edit</button>
      <button className="admin-btn" onClick={() => handleDeletePost(id)}>Delete</button>
            <Popup trigger={open} setTrigger={setOpen}>
        <EditPost id={id} />
      </Popup>
    </div>
  );
};

export default PostActions;