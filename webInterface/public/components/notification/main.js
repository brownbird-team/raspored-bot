import * as service from "../../services/main.js";


export const createNotification = (message, positive=true) => {
    if (document.querySelector(".notification-root") != null) {
        service.removeElement(document.querySelector(".notification-root"));
    }

    let iconPath = "/static/components/notification/assets/icon-status-ok.png";
    if (!positive) {
        iconPath = "/static/components/notification/assets/icon-status-not-ok.png";
    }
    // Notification Root
    const notificationRoot = document.createElement("div");
    notificationRoot.classList.add("notification-root");
    document.body.appendChild(notificationRoot);

    // Notification Ok Status
    const notificationOkStatus = document.createElement("img");
    notificationOkStatus.src = iconPath;
    notificationOkStatus.width = "30";
    notificationOkStatus.height = "30";
    notificationRoot.appendChild(notificationOkStatus);

    // Notification Message
    const notificationMessage = document.createElement("p");
    notificationMessage.innerText = message;
    notificationRoot.appendChild(notificationMessage);

    // Notification Exit Button
    const notificationExitButton = document.createElement("button");
    notificationExitButton.innerHTML = "&#x2715;";
    notificationRoot.appendChild(notificationExitButton);
    notificationExitButton.addEventListener("click", () => {
        service.removeElement(notificationRoot);
    });

    // Slide In/Out
    notificationRoot.style.animationDuration = "2s";
    notificationRoot.style.animationName = "slideIn";
    setTimeout(() => {
        notificationRoot.style.animationDuration = "2.2s";
        notificationRoot.style.animationName = "slideOut";
        setTimeout(() => {
            service.removeElement(notificationRoot);
        }, 2000);
    }, 5000);
}