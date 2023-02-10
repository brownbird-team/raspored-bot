import * as service from "../../services/main.js";
import { createRegistrationModal } from "../registration/main.js";
import { createEmailLoginModal } from "./email.js";


export const createLoginModal = () => {
    if (document.querySelector(".login-root") != null) {
        return;
    }

    const root = document.createElement("div");
    root.classList.add("modal-root")
    root.classList.add("login-root");
    document.body.appendChild(root);

    const heading = document.createElement("div");
    heading.classList.add("modal-heading");
    heading.classList.add("login-heading");
    root.appendChild(heading);

    const title = document.createElement("h3");
    title.classList.add("modal-heading-title");
    title.innerText = "Prijava";
    heading.appendChild(title);

    const exitButton = document.createElement("button");
    exitButton.classList.add("modal-heading-exit-button");
    exitButton.innerHTML = "&#x2715;";
    heading.appendChild(exitButton);

    exitButton.addEventListener("click", () => {
        service.unBlurElement(document.querySelector(".home"));
        service.unBlurElement(document.querySelector(".project-goal"));
        service.removeElement(root);
    });

    const body = document.createElement("div");
    body.classList.add("modal-body");
    root.appendChild(body);

    const subtitle = document.createElement("h5");
    subtitle.classList.add("login-subtitle");
    subtitle.innerText = "Prijavite se putem Emaila ili Discorda";
    body.appendChild(subtitle);

    const emailButton = document.createElement("button");
    emailButton.classList.add("login-button");
    emailButton.classList.add("login-email-button");
    body.appendChild(emailButton);

    emailButton.addEventListener("click", () => {
        service.removeElement(root);
        createEmailLoginModal();
    });

    const emailButtonIcon = document.createElement("img");
    emailButtonIcon.src = "/static/components/login/assets/Email_Icon.png";
    emailButtonIcon.width = "28";
    emailButtonIcon.height = "28";
    emailButton.appendChild(emailButtonIcon);

    const emailButtonText = document.createElement("p");
    emailButtonText.innerText = "Email";
    emailButton.appendChild(emailButtonText);

    const discordButton = document.createElement("button");
    discordButton.classList.add("login-button");
    discordButton.classList.add("login-discord-button");
    body.appendChild(discordButton);

    const discordButtonIcon = document.createElement("img");
    discordButtonIcon.src = "/static/components/login/assets/Discord_Logo.png";
    discordButtonIcon.width = "28";
    discordButtonIcon.height = "28";
    discordButton.appendChild(discordButtonIcon);

    const discordButtonText = document.createElement("p");
    discordButtonText.innerText = "Discord";
    discordButton.appendChild(discordButtonText);

    const footer = document.createElement("div");
    footer.classList.add("modal-footer");
    root.appendChild(footer);

    const footerText = document.createElement("p");
    footerText.classList.add("login-footer-text");
    footerText.innerHTML = `Nemaš korisnički račun? Nema problema, <span class="link create-account">kreiraj ga sada</span>`;
    footer.appendChild(footerText);

    const createAccount = footerText.querySelector(".create-account");
    
    createAccount.addEventListener("click", () => {
        service.removeElement(root);
        createRegistrationModal();
    });
}