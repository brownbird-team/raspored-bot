import * as service from "../../services/main.js";


export const selectClass = () => {
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
    const classes = [
        "1.A", "1.B", "1.C", "1.D", "1.O", "1.E", "1.F", "1.G", "1.M", "1.N",
        "2.A", "2.B", "2.C", "2.D", "2.O", "2.E", "2.F", "2.G", "2.M", "2.N",
        "3.A", "3.B", "3.C", "3.D", "3.O", "3.E", "3.F", "3.G", "3.M", "3.N",
        "4.A", "4.B", "4.C", "4.D", "4.O", "4.E", "4.F", "4.G", "4.M", "4.N",
    ];

    for (let cl of classes) {
        const container = document.createElement("button");
        container.classList.add("select-class-container");
        container.innerText = cl;
        container.value = cl;
        classesContainer.appendChild(container);
    }
}