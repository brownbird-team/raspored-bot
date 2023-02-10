import * as service from "../../services/main.js";
import { createNotification } from "../notification/main.js";
import { main } from "../main.js";


export const deleteWarning = () => {
    if (document.querySelector(".delete-warning") !== null ||
        document.querySelector(".modal-root") !== null) {
        return;
    }

    // Disable Save Button
    document.querySelector(".save-settings").disabled = true;

    const root = document.createElement("div");
    root.classList.add("modal-root");
    root.classList.add("delete-warning");
    document.body.appendChild(root);

    const heading = document.createElement("div");
    heading.classList.add("modal-heading");
    root.appendChild(heading);

    const title = document.createElement("h3");
    title.classList.add("modal-heading-title");
    title.innerText = "Želite izbrisati račun?";
    heading.appendChild(title);

    const exitButton = document.createElement("button");
    exitButton.classList.add("modal-heading-exit-button");
    exitButton.innerHTML = "&#x2715;";
    heading.appendChild(exitButton);

    exitButton.addEventListener("click", () => {
        document.querySelector(".save-settings").disabled = false;
        service.unBlurElement(document.querySelector(".control-panel-root"));
        service.removeElement(root);
    });

    const body = document.createElement("div");
    body.classList.add("modal-body");
    root.appendChild(body);

    const message = document.createElement("p");
    message.classList.add("delete-warning-message");
    message.innerHTML = "Pritiskom na tipku 'Izbriši', izbrisat ćete sve postavke i račun koji je povezan s <span class='yellow'>Raspored botom</span>.";
    body.appendChild(message);

    const footer = document.createElement("div");
    footer.classList.add("modal-footer");
    footer.classList.add("delete-warning-footer");
    root.appendChild(footer);

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("raspored-bot-button");
    cancelButton.classList.add("cancel-button");
    cancelButton.innerText = "Odustani";
    footer.appendChild(cancelButton);

    cancelButton.addEventListener("click", () => {
        document.querySelector(".save-settings").disabled = false;
        service.unBlurElement(document.querySelector(".control-panel-root"));
        service.removeElement(root);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("raspored-bot-button");
    deleteButton.classList.add("delete-account");
    deleteButton.classList.add("delete-warning-delete-button");
    deleteButton.innerText = "Izbriši";
    footer.appendChild(deleteButton);

    deleteButton.addEventListener("click", async() => {
        await fetch("/api/email/account", {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + window.localStorage.getItem("emailToken")
            },
            method: "DELETE"
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            if (json.status == "ok") {
                createNotification("Račun je uspješno obrisan");
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