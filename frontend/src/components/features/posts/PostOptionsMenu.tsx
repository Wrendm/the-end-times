import { useState, useRef, useEffect } from "react";
import { BsBrush, BsFillTrash3Fill } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";

type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

export default function PostOptionsMenu({ onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ position: "relative" }} ref={menuRef}>
            <button className="btn-minimal" onClick={toggleMenu} style={{ fontSize: "18px" }}>
                <CiMenuKebab />
            </button>

            {open && (
                <div className="PostOptionMenu">
                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="PostMenuItem"
                    >
                        <BsBrush />
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="PostMenuItem"
                        style={{color: "crimson" }}
                    >
                        <BsFillTrash3Fill />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}