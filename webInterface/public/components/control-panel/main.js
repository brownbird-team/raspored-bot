import * as service from "../../services/main.js";
import { selectClass } from "./select-class.js";
import { deleteWarning } from "./delete-warning.js";
import { createNotification } from "../notification/main.js";


export const createControlPanel = (userData) => {
    if (document.querySelector(".control-panel-root") != null) {
        return;
    }

    let selectedClass = userData.class;

    const root = document.createElement("div");
    root.classList.add("control-panel-root");
    document.body.appendChild(root);

    const heading = document.createElement("div");
    heading.classList.add("control-panel-heading");
    root.appendChild(heading);

    const title = document.createElement("h3");
    title.innerText = "Kontrolna ploča";
    heading.appendChild(title);

    const body = document.createElement("div");
    body.classList.add("control-panel-body");
    root.appendChild(body);

    const settings = document.createElement("div");
    settings.classList.add("control-panel-settings");
    body.appendChild(settings);

    // Email
    const emailContainer = document.createElement("div");
    emailContainer.classList.add("control-panel-email");
    emailContainer.classList.add("registration-email-container");
    settings.appendChild(emailContainer);

    const emailContainerTitle = document.createElement("h4");
    emailContainerTitle.innerText = "Email";
    emailContainer.appendChild(emailContainerTitle);

    const emailInputContainer = document.createElement("div");
    emailInputContainer.classList.add("control-panel-email-input")
    emailInputContainer.classList.add("registration-email-input-container");
    emailContainer.appendChild(emailInputContainer);

    const emailInput = document.createElement("p");
    emailInput.innerText = userData.email;
    emailInputContainer.appendChild(emailInput);

    // Subtitle
    const classSubtitle = document.createElement("h5");
    classSubtitle.innerText = "Generalne postavke";
    settings.appendChild(classSubtitle);

    // Class
    const classContainer = document.createElement("div");
    classContainer.classList.add("control-panel-class");
    classContainer.classList.add("registration-email-container");
    settings.appendChild(classContainer);

    const classContainerTitle = document.createElement("h4");
    classContainerTitle.innerText = "Razred";
    classContainer.appendChild(classContainerTitle);

    const classInputContainer = document.createElement("div");
    classInputContainer.classList.add("control-panel-class-input")
    classInputContainer.classList.add("registration-email-input-container");
    classContainer.appendChild(classInputContainer);

    const classInput = document.createElement("p");
    if (selectedClass !== null) {
        classInput.innerText = selectedClass;
    } else {
        classInput.innerText = "Odaberite razred";
    }
    classInputContainer.appendChild(classInput);

    // Options
    const controlPanelOption = document.createElement("div");
    controlPanelOption.classList.add("control-panel-option");
    settings.appendChild(controlPanelOption);

    const optionId = ["all", "theme", "mute"];
    const options = ["Želim primati sve obavijesti o dnevnim izmjenama",
                     "Želim primati dnevne izmjene u tamnoj temi",
                     "Želim primati dnevne izmjene"];

    const optionsState = [userData.all, (userData.theme == "dark"), !userData.mute];
                         
    for (let option = 0; option < options.length; option++) {
        const optionContainer = document.createElement("div");
        optionContainer.classList.add("control-panel-option-container");
        controlPanelOption.appendChild(optionContainer);
    
        const optionButton = document.createElement("input");
        optionButton.classList.add("raspored-bot-custom-button");
        optionButton.type = "checkbox";
        optionButton.id = optionId[option];
        optionButton.checked = optionsState[option];
        optionContainer.appendChild(optionButton);

        const optionText = document.createElement("p");
        optionText.innerText = options[option];
        optionContainer.appendChild(optionText);
    }

    // Subtitle
    const accountSubtitle = document.createElement("h5");
    accountSubtitle.innerText = "Postavke računa";
    settings.appendChild(accountSubtitle);

    const buttons = document.createElement("div");
    buttons.classList.add("control-panel-footer-buttons");
    settings.appendChild(buttons);

    // Delete account
    const deleteAccount = document.createElement("button");
    deleteAccount.classList.add("raspored-bot-button");
    deleteAccount.classList.add("delete-account");
    deleteAccount.innerText = "Izbriši račun";
    buttons.appendChild(deleteAccount);

    deleteAccount.addEventListener("click", () => {
        service.blurElement(root);
        deleteWarning();
    });

    // Save settings
    const saveSettings = document.createElement("button");
    saveSettings.classList.add("raspored-bot-button");
    saveSettings.classList.add("save-settings");
    saveSettings.innerText = "Spremi promjene";
    buttons.appendChild(saveSettings);


    classContainer.addEventListener("click", () => {
        if (document.querySelector(".select-class") != null) {
            return;
        }

        service.blurElement(root);
        selectClass();
        for (let cl of document.getElementsByClassName("select-class-container")) {
            cl.addEventListener("click", () => {
                saveSettings.disabled = false;
                selectedClass = cl.value;
                classInput.innerText = selectedClass;
                service.unBlurElement(root);
                service.removeElement(document.querySelector(".select-class"));
            });
        }
    });


    saveSettings.addEventListener("click", async() => {
        userData.class = selectedClass;
        userData.all = (document.getElementById("all").checked);
        userData.theme = (document.getElementById("theme").checked) ? "dark" : "light";
        userData.mute = !(document.getElementById("mute").checked);

        await fetch("/api/email/account", {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + window.localStorage.getItem("emailToken"), 
            },
            method: "PUT",
            body: JSON.stringify(userData)
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            if (json.status == "ok") {
                createNotification("Postavke računa su uspješno promijenjene");
            }
        })
        .catch((err) => console.error(err));
    });
}