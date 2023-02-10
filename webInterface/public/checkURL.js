import { createNotification } from "./components/notification/main.js";


const checkURL = async() => {
    let pathnameSplit = window.location.pathname.split("/");
    if (pathnameSplit.length === 3 && pathnameSplit[1] === "login") {
        const tempToken = pathnameSplit[2];
        
        await fetch("/api/email/auth/permanent", {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + tempToken
            },
            method: "POST"
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            if (json.status == "ok") {
                window.location.href = "/";
                
                if (typeof window.localStorage !== undefined) {
                    window.localStorage.setItem("emailToken", json.token);
                }
            }

            if (json.status == "error") {
                switch(json.name) {
                    case "AuthorizationError": 
                        createNotification("Autorizacijski token nije validan ili je istekao", false);
                        break;
                    default:
                        createNotification("Greška u sustavu, pokušajte kasnije", false);
                }
            }
        })
        .catch((err) => console.error(err));
    }
}


checkURL();