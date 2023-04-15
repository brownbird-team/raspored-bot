import * as service from "../../services/main.js";


export const selectClass = async () => {
    if (document.querySelector(".select-class") !== null ||
        document.querySelector(".modal-root") !== null) {
        return;
    }

    // Disable Save Button
    document.querySelector(".save-settings").disabled = true;

    const root = document.createElement("div");
    root.classList.add("modal-root");
    root.classList.add("select-class");
    document.body.appendChild(root);

    const heading = document.createElement("div");
    heading.classList.add("modal-heading");
    root.appendChild(heading);

    const title = document.createElement("h3");
    title.classList.add("modal-heading-title");
    title.innerText = "Odaberite razred";
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
    body.classList.add("select-class-body");
    root.appendChild(body);

    const classesContainer = document.createElement("div");
    classesContainer.classList.add("select-class-main-container");
    body.appendChild(classesContainer);

    let result = await fetch(`/api/general/classes/active`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });

    result = await result.json();
    
    for (let cl of result.classes) {
        const container = document.createElement("button");
        container.classList.add("select-class-container");
        container.innerText = cl.name;
        container.value = cl.name;
        classesContainer.appendChild(container);
    }
}