export class NotificationSuccess {
    constructor(message = "") {
        this.message = message;
        this.type = "success";
    }

    setMessage(message) {
        this.message = message;
    }
}

export class NotificationWarning {
    constructor(message = "") {
        this.message = message;
        this.type = "danger";
    }

    setMessage(message) {
        this.message = message;
    }
}
