export default class CreateChange {
	 
	constructor(name=null, date=null, shift=null, morning=null) {
		this.name = name;
		this.date = date;
		this.shift = shift;
		this.morning = morning;
		this.heading = null;
	}

	setName(value) {
		this.name = value;
		return this;
	}

	setDate(value) {
		this.date = new Date(value);
		return this;
	}

	setShift(value) {
		this.shift = value;
		return this;
	}

	setMorning(value) {
		(value === "true") ? this.morning = true : this.morning = false;
		return this;
	}

	setHeading() {
		const dateOptions = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		}

		this.heading = this.name + " " + this.date.toLocaleDateString("hr", dateOptions);
		return this;
	}

	getName() {
		return this.name;
	}

	getDate() {
		return this.date;
	}

	getShift() {
		return this.shift;
	}

	getMorning() {
		return this.morning;
	}

	getHeading() {
		return this.heading;
	}

	validateName() { 
		return (!this.name) ? false : true; 
	}

	validateDate() {
		return Math.floor(this.date.getTime() / 1000 / 60 / 60 / 24) > Math.floor(Date.now() / 1000 / 60 / 60 / 24 - 1)
	}
}