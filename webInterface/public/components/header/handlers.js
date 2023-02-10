import { createHome } from "../homePage/home/main.js";
import { createProjectGoal } from "../homePage/projectGoal/main.js";
import { createRegistrationModal } from "../registration/main.js";
import { createLoginModal } from "../login/main.js";
import { createProfileMenu } from "../header/menu.js";
import * as service from "../../services/main.js";


export const homeHandler = () => {
    if (document.querySelector(".modal-root") !== null) {
        return;
    }
    service.removeElement(document.querySelector(".control-panel-root"));
    createHome();
    createProjectGoal();
    window.location.href = "#home";
}


export const contactHandler = () => {
    return;
}


export const goalHandler = () => {
    if (document.querySelector(".modal-root") !== null) {
        return;
    }
    service.removeElement(document.querySelector(".control-panel-root"));
    createHome();
    createProjectGoal();
    window.location.href = "#project-goal";
}


export const registerHandler = () => {
    if (document.querySelector(".modal-root") != null) {
        return;
    }
    service.blurElement(document.querySelector(".home"));
    service.blurElement(document.querySelector(".project-goal"));
    createRegistrationModal();
}


export const loginHandler = () => {
    if (document.querySelector(".modal-root") != null) {
        return;
    }
    service.blurElement(document.querySelector(".home"));
    service.blurElement(document.querySelector(".project-goal"));
    createLoginModal();
}


export const profileMenuHandler = (userData) => {
    createProfileMenu(userData);
}