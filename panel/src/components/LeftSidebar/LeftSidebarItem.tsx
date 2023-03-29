import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  tooltip: string;
}

const LeftSidebarItem = ({ children, tooltip }: Props) => {
  return (
    <div className="left-sidebar-item">
      <button type="button">{children}</button>
      <span className="item-tooltip">{tooltip}</span>
    </div>
  );
};

export default LeftSidebarItem;
