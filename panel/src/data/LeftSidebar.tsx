import { ReactNode } from "react";
import { IoSchool, BsTable, IoSettings, BiLogOut } from "react-icons/all";

/*  Ovdje se definira struktura izbornika i podizbornika (LeftSidebar)  */

const items = [
  {
    title: "Unos rasporeda",
    icon: <IoSchool size={30} />,
    children: [
      {
        title: "Uvezi",
        path: "/import",
      },
    ],
  },
  {
    title: "Unos izmjena",
    icon: <BsTable size={30} />,
    children: [
      {
        title: "Predmeti / učionice",
        path: "/",
      },
    ],
  },
  {
    title: "Postavke",
    icon: <IoSettings size={30} />,
    children: [
      {
        title: "Grupacija",
        children: [
          { title: "Razreda", path: "/" },
          { title: "Perioda", path: "/" },
        ],
      },
    ],
  },
  {
    title: "Odjava",
    icon: <BiLogOut size={30} />,
  },
];

export default items;
