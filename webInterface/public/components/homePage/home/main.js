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
    rightPanelDesc.innerHTML = "Želite primati dnevne izmjene koristeći našeg <span class='yellow'>Discord bota</span> ?";
    rightPanelTextContainer.appendChild(rightPanelDesc);

    // Right Panel Item Container
    const rightPanelItemContainer = document.createElement("div");
    rightPanelContainer.appendChild(rightPanelItemContainer);

    // Discord Invite Button
    const discordInviteButton = document.createElement("button");
    discordInviteButton.classList.add("discord-invite-button");
    discordInviteButton.innerText = "Dodaj bota";
    
    discordInviteButton.addEventListener("click", async() => {
        await fetch("/api/general/discord/invite", {
            headers: {
                "Content-Type" : "application/json",
            },
            method: "GET"
        })
        .then((res) => res.json())
        .then((json) => {
            if (json.status == "ok") {
                window.open(json.link, "_blank");
            }
        })
        .catch((err) => console.error(err));
    });

    rightPanelItemContainer.appendChild(discordInviteButton);
}