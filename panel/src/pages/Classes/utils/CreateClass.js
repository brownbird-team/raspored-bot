export default class CreateClass {

	constructor(name=null, shift=null) {
		this.name = name;
		this.shift = shift;
	}

	setName(value) {
		this.name = value;
		this.trimName();
		return this;
	} 

	setShift(value) {
		this.shift = value;
		return this;
	}

	getName() {
		return this.name;
	}

	getShift() {
		return this.shift;
	}

	trimName() {
		const regexPattern = /\s+/g;
		this.name = this.name.replace(regexPattern, "");
		return this;
	}
 
	validate() {
		if (this.name === null || this.shift === null) return false;
		return true;
	}

	reset() {
		this.name = "";
		this.shift = "";
	}
}