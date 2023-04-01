import { IoSchool, BsTable, IoSettings, BiLogOut } from "react-icons/all";
import routes from "./Routes.json";

/*  Ovdje se definira struktura izbornika i podizbornika (LeftSidebar)  */

const items = [
    {
        title: "Unos rasporeda",
        icon: <IoSchool size={30} />,
        children: [
            {
                title: "Uvezi",
                path: routes.schedule.import.path,
            },
        ],
    },
    {
        title: "Unos izmjena",
        icon: <BsTable size={30} />,
        children: [
            {
                title: "Predmeti / učionice",
                path: routes.changes.subject_classroom.path,
            },
        ],
    },
    {
        title: "Postavke",
        icon: <IoSettings size={30} />,
        children: [
            {
                title: "Filteri",
                children: [
                    { title: "Razreda", path: routes.filter.class.path },
                    { title: "Perioda", path: routes.filter.period.path },
                ],
            },
        ],
    },
    {
        title: "Odjava",
        icon: <BiLogOut size={30} />,
        path: routes.logout.path,
    },
];

export default items;
