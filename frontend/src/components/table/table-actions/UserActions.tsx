import { useState } from "react";
import Popup from "../../ui/Popup";
import EditUser from "../../features/users/EditUser";
import EditUserRoles from "../../features/users/EditUserRoles";

type UserActionsProps = {
  id: string;
  handleDeleteUser: (id: string) => void;
};

const UserActions = ({ id, handleDeleteUser }: UserActionsProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditRoles, setOpenEditRoles] = useState(false);
  return (
    <div className="actions ButtonRow">
      <button className="admin-btn" onClick={() => setOpenEdit(true)}>Edit</button>
      <button className="admin-btn"  onClick={() => setOpenEditRoles(true)}>Edit Roles</button>
      <button className="admin-btn" onClick={() => handleDeleteUser(id)}>Delete</button>
      <Popup trigger={openEdit} setTrigger={setOpenEdit}>
        <EditUser id={id} />
      </Popup>
      <Popup trigger={openEditRoles} setTrigger={setOpenEditRoles}>
        <EditUserRoles id={id} />
      </Popup>
    </div>
  );
};

export default UserActions;