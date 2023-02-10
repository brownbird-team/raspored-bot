import * as service from "../../services/main.js";
import { createControlPanel } from "../control-panel/main.js";
import { main } from "../main.js";


export const createProfileMenu = (userData) => {
    if (document.querySelector(".profile-menu-root") != null) {
        service.removeElement(document.querySelector(".profile-menu-root"));
        return;
    }

    const root = document.createElement("div");
    root.classList.add("profile-menu-root");
    document.body.appendChild(root);

    const user = document.createElement("div");
    user.classList.add("profile-menu-item");
    user.classList.add("profile-menu-user");
    root.appendChild(user);

    const userEmail = document.createElement("p");
    userEmail.innerText = userData.email;
    user.appendChild(userEmail);

    const controlPanel = document.createElement("div");
    controlPanel.classList.add("profile-menu-item");
    controlPanel.classList.add("profile-menu-control-panel");
    root.appendChild(controlPanel);

    const controlPanelButton = document.createElement("button");
    controlPanelButton.innerText = "Kontrolna ploča";
    controlPanel.appendChild(controlPanelButton);

    controlPanelButton.addEventListener("click", () => {
        service.removeElement(document.querySelector(".home"));
        service.removeElement(document.querySelector(".project-goal"));
        createControlPanel(userData);
        service.removeElement(root);
    });

    const logout = document.createElement("div");
    logout.classList.add("profile-menu-item");
    logout.classList.add("profile-menu-logout");
    root.appendChild(logout);

    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Odjava";
    logout.appendChild(logoutButton);

    logoutButton.addEventListener("click", async() => {
        service.removeElement(root);
        
        await fetch("/api/email/auth/logout", {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + window.localStorage.getItem("emailToken")
            },
            method: "POST"
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            if (json.status == "ok") {
                window.localStorage.removeItem("emailToken");
                service.removeElement(document.querySelector(".home-heading"));
                service.removeElement(document.querySelector(".control-panel-root"));
                service.removeElement(document.querySelector(".delete-warning"));
                service.removeElement(document.querySelector(".select-class"));
                service.removeElement(document.querySelector(".home"));
                service.removeElement(document.querySelector(".project-goal"));
                main();
            }
        })
        .catch((err) => console.error(err));
    });
}