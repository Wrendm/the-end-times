import { useEffect, useRef } from 'react';

type PopupProps = {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  children: React.ReactNode;
};

const Popup = (props: PopupProps) => {
const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        props.setTrigger(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner" ref={ref}>
            <button className="close-btn btn-secondary" onClick={() => props.setTrigger(false)}>X</button>
            {props.children}
        </div>
    </div>
  ) : "";
};

export default Popup;

