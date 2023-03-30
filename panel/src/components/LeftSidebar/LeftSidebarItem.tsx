import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LeftSidebarItem = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (item.children) {
    return (
      <div className={open ? "left-sidebar-item open" : "left-sidebar-item"}>
        <div className="left-sidebar-parent">
          <button type="button" onClick={() => setOpen(!open)}>
            {item.icon}
            <span>{item.title}</span>
            {open ? (
              <MdOutlineKeyboardArrowDown size={30} className="arrow down" />
            ) : (
              <MdOutlineKeyboardArrowDown size={30} className="arrow up" />
            )}
          </button>
          <span className="item-tooltip">{item.title}</span>
        </div>

        <div className="left-sidebar-children">
          {item.children.map((child: any) => (
            <LeftSidebarItem key={child.title} item={child} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="left-sidebar-item">
        <div className="left-sidebar-parent">
          <button type="button" onClick={() => navigate(item.path)}>
            {item.icon}
            <span>{item.title}</span>
          </button>
          <span className="item-tooltip">{item.title}</span>
        </div>
      </div>
    );
  }
};

export default LeftSidebarItem;
