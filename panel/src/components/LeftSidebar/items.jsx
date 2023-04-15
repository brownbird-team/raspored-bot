import { BsTable, IoSettings, BiLogOut } from "react-icons/all";
import routes from "../../data/routes.json";

/*  Ovdje se definira struktura izbornika i podizbornika (LeftSidebar)  */

const items = [
    {
        title: "Unos izmjena",
        icon: <BsTable size={30} />,
        children: [
            {
                title: "Predmeti",
                path: routes.changes.path,
            },
        ],
    },
    {
        title: "Postavke",
        icon: <IoSettings size={30} />,
        children: [
            {
                title: "Razredi",
                path: routes.settings.classes.path,
            }
        ],
    },
    {
        title: "Odjava",
        icon: <BiLogOut size={30} />,
        path: routes.logout.path,
    },
];

export default items;
