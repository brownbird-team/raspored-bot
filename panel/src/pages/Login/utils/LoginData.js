export default class LoginData {
	constructor(username="", password="") {
		this.username = username;
		this.password = password;
	}

	setUsername(value) {
		this.username = value;
		return this;
	}

	setPassword(value) {
		this.password = value;
		return this;
	}

	getUsername() {
		return this.username;
	}

	validate() {
		if (this.username === "" || this.password === "") return false;
		return true;
	}
}