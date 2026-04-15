type PopupProps = {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  children: React.ReactNode;
};

const Popup = (props: PopupProps) => {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner">
            <button className="close-btn" onClick={() => props.setTrigger(false)}>X</button>
            {props.children}
        </div>
    </div>
  ) : "";
};

export default Popup;

