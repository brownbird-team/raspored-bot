import * as service from "../../services/main.js";
import * as checkInput from "../../services/checkInput.js";
import { createNotification } from "../notification/main.js";


export const createRegistrationModal = () => {
    if (document.querySelector(".registration-root") != null) {
        return;
    }

    const root = document.createElement("div");
    root.classList.add("modal-root");
    root.classList.add("registration-root");
    document.body.appendChild(root);

    const heading = document.createElement("div");
    heading.classList.add("modal-heading");
    root.appendChild(heading);

    const title = document.createElement("h3");
    title.classList.add("modal-heading-title");
    title.innerText = "Registracija";
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

    const emailContainer = document.createElement("div");
    emailContainer.classList.add("registration-email-container");
    body.appendChild(emailContainer);

    const emailContainerTitle = document.createElement("h4");
    emailContainerTitle.innerHTML = "Email<span class='yellow'>*</span>";
    emailContainer.appendChild(emailContainerTitle);

    const emailInputContainer = document.createElement("div");
    emailInputContainer.classList.add("registration-email-input-container");
    emailContainer.appendChild(emailInputContainer);

    const emailIcon = document.createElement("img");
    emailIcon.src = "/static/components/registration/assets/Email_Icon.png";
    emailIcon.width = "24";
    emailIcon.height = "24";
    emailInputContainer.appendChild(emailIcon);

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.maxLength = "320";
    emailInput.placeholder = "Vaša email adresa";
    emailInputContainer.appendChild(emailInput);

    emailInput.addEventListener("input", () => {
        const check = checkInput.validateEmail(emailInput.value);
        if (check) {
            emailContainer.style.borderBottomColor = "var(--tertiary)";
        } else {
            emailContainer.style.borderBottomColor = "var(--quinary)";
        }
    });

    const footer = document.createElement("div");
    footer.classList.add("modal-footer");
    root.appendChild(footer);

    const registrationButton = document.createElement("button");
    registrationButton.classList.add("modal-footer-button");
    footer.appendChild(registrationButton);

    const registrationButtonName = document.createElement("p");
    registrationButtonName.classList.add("modal-footer-button-name");
    registrationButtonName.innerText = "Registriraj se";
    registrationButton.appendChild(registrationButtonName);

    const registrationButtonIcon = document.createElement("img");
    registrationButtonIcon.classList.add("modal-footer-button-icon");
    registrationButtonIcon.src = "/static/components/registration/assets/Next_Icon.png";
    registrationButtonIcon.width = "20";
    registrationButtonIcon.height = "20";
    registrationButton.appendChild(registrationButtonIcon);

    registrationButton.addEventListener("click", async() => {
        const check = checkInput.validateEmail(emailInput.value);
        if (!check) {
            createNotification("Neispravna Email adresa", false);
            return;
        }

        const data = JSON.stringify({email: emailInput.value});

        await fetch("/api/email/auth/register", {
            headers: {
                "Content-Type" : "application/json"
            },
            method: "POST",
            body: data
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            if (json.status == "ok") {
                createNotification("Email za registraciju je uspješno poslan");
            }

            if (json.status == "error") {
                switch(json.name) {
                    case "TooManyAttemptsError":
                        createNotification("Kreirali ste previše registracijskih tokena, pokušajte ponovno kasnije", false);
                        break;
                    case "RegistrationError":
                        createNotification("Korisnički račun već postoji", false);
                        break;
                    case "EmailError": 
                        createNotification("Došlo je pogreške prilikom slanje Emaila", false);
                        break;
                    default:
                        createNotification("Greška u sustavu, pokušajte kasnije", false);
                }
            }
        })
        .catch((err) => console.error(err));
    });
}