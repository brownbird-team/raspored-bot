import { ReactNode } from "react";
import { IoSchool, BsTable, IoSettings, BiLogOut } from "react-icons/all";

interface Item {
  title: string;
  children?: Item[];
}

export interface Items {
  title: string;
  icon?: ReactNode;
  children?: Item[];
}

const items: Items[] = [
  {
    title: "Unos rasporeda",
    icon: <IoSchool size={30} />,
    children: [
      {
        title: "Uvezi",
      },
    ],
  },
  {
    title: "Unos izmjena",
    icon: <BsTable size={30} />,
    children: [
      {
        title: "Predmeti / učionice",
      },
    ],
  },
  {
    title: "Postavke",
    icon: <IoSettings size={30} />,
    children: [
      {
        title: "Grupacija",
        children: [{ title: "Razreda" }, { title: "Perioda" }],
      },
    ],
  },
  {
    title: "Odjava",
    icon: <BiLogOut size={30} />,
  },
];

export default items;
