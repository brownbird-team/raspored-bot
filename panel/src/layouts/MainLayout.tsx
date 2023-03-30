import React, { ReactNode } from "react";
import "./MainLayout.css";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return <div className="main-layout">{children}</div>;
};

export default MainLayout;
