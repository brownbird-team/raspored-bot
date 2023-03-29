import { useState } from "react";
import { Items } from "../../data/LeftSidebar";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface Props {
  item: Items;
}

const LeftSidebarItem = ({ item }: Props) => {
  const [open, setOpen] = useState(false);

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
          {item.children.map((child: Items) => (
            <div key={child.title}>{child.title}</div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="left-sidebar-item">
        <div className="left-sidebar-parent">
          <button type="button">
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
