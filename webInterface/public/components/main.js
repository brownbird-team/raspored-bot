import { createHeader } from "./header/main.js";
import { createHome } from "./homePage/home/main.js";
import { createProjectGoal } from "./homePage/projectGoal/main.js";
import * as handler from "./header/handlers.js";


const headerLinksDefault = {
    left: {
        0: {name: "Kontakt", class: "header-link", handler: handler.contactHandler},
        1: {name: "Cilj projekta", class: "header-link", handler: handler.goalHandler},
    },
    right: {
        0: {name: "Registriraj se", class: "header-link", handler: handler.registerHandler},
        1: {name: "Prijavi se", class: "header-link", handler: handler.loginHandler},
    }
};


const headerLinksLogin = {
    left: {
        0: {name: "Početna", class: "header-link", handler: handler.homeHandler},
        1: {name: "Kontakt", class: "header-link", handler: handler.contactHandler},
        2: {name: "Cilj projekta", class: "header-link", handler: handler.goalHandler},
    },
    right: {
        0: {name: "Prijavljeni", class: "header-profile"}
    }
};


export const main = async() => {
    let pathnameSplit = window.location.pathname.split("/");
    if (pathnameSplit[1] !== "login") {
        const token = window.localStorage.getItem("emailToken");
        if (token !== undefined) {
            await fetch("/api/email/account", {
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + token
                },
                method: "GET"
            })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if (json.status == "ok") {
                    const userData = {
                        email: json.email,
                        all: json.all,
                        class: json.class,
                        mute: json.mute,
                        theme: json.theme
                    };
                    const profileMenuHandlerParams = () => {
                        handler.profileMenuHandler(userData);
                    }
                    headerLinksLogin.right[0].handler = profileMenuHandlerParams;
                    createHeader(headerLinksLogin);
                }
    
                if (json.status == "error") {
                    createHeader(headerLinksDefault);
                }
                
                createHome();
                createProjectGoal();
            })
            .catch((err) => console.error(err));
        }
        createHeader(headerLinksDefault);
        createHome();
        createProjectGoal();
    }
}


main();