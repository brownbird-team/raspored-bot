import * as service from "../../../services/main.js";
import { createRegistrationModal } from "../../registration/main.js";


export const createHome = () => {
    if (document.querySelector(".home") != null) {
        return;
    }
    
    // Root
    const root = document.createElement("div");
    root.classList.add("home");
    document.body.appendChild(root);

    // Home Title Container
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("home-title-container");
    root.appendChild(titleContainer);

    // Home Title
    const title = document.createElement("h1");
    title.innerText = "Raspored bot";
    titleContainer.appendChild(title);

    // Home Subtitle
    const subtitle = document.createElement("h3");
    subtitle.innerText = "BrownBird Team";
    titleContainer.appendChild(subtitle);

    // Body
    const body = document.createElement("div");
    body.classList.add("home-body");
    root.appendChild(body);

    // Left Panel
    const leftPanel = document.createElement("div");
    leftPanel.classList.add("home-left-panel");
    body.appendChild(leftPanel);

    // Left Panel Container
    const leftPanelContainer = document.createElement("div");
    leftPanel.appendChild(leftPanelContainer);

    const leftPanelTexts = [
        "Brzo i jednostavno korištenje",
        "Sustav za praćenje izmjena u rasporedu sati",
        "Podržane različite platforme"
    ];

    for (const leftPanelText of leftPanelTexts) {
        const panelItem = document.createElement("div");
        leftPanelContainer.appendChild(panelItem);
        
        const mark = document.createElement("img");
        mark.src = "/static/components/homePage/home/assets/Kvacica.png";
        panelItem.appendChild(mark);
        
        const text = document.createElement("p");
        text.innerText = leftPanelText;
        panelItem.appendChild(text);
    }

    // Raspored bot Logo
    const rasporedBotLogo = document.createElement("img");
    rasporedBotLogo.src = "/static/components/homePage/home/assets/raspored_bot_logo.png";
    rasporedBotLogo.width = "300";
    rasporedBotLogo.height = "300";
    body.appendChild(rasporedBotLogo);

    // Right Panel
    const rightPanel = document.createElement("div");
    rightPanel.classList.add("home-right-panel");
    body.appendChild(rightPanel);

    // Right Panel Container
    const rightPanelContainer = document.createElement("div");
    rightPanel.appendChild(rightPanelContainer);

    // Right Panel Text Container
    const rightPanelTextContainer = document.createElement("div");
    rightPanelContainer.appendChild(rightPanelTextContainer);

    // Right Panel Desc
    const rightPanelDesc = document.createElement("p");
    rightPanelDesc.innerText = "Želite početi primati dnevne izmjene u rasporedu sati, ali niste sigurni kako ?";
    rightPanelTextContainer.appendChild(rightPanelDesc);

    // Right Panel Item Container
    const rightPanelItemContainer = document.createElement("div");
    rightPanelContainer.appendChild(rightPanelItemContainer);

    // Right Panel Mark
    const rightPanelMark = document.createElement("img");
    rightPanelMark.src = "/static/components/homePage/home/assets/Kvacica.png";
    rightPanelItemContainer.appendChild(rightPanelMark);

    // Right Panel Text
    const rightPanelText = document.createElement("p");
    rightPanelText.innerHTML = "Registriraj se putem <span class='register-with'>Emaila</span>";
    rightPanelItemContainer.appendChild(rightPanelText);

    document.querySelector(".register-with").addEventListener("click", () => {
        if (document.querySelector(".header-profile") != null) {
            return
        };
        service.blurElement(document.querySelector(".home"));
        service.blurElement(document.querySelector(".project-goal"));
        createRegistrationModal();
    });
}