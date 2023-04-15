export default class CreateClass {

	constructor(className=null, shift=null) {
		this.className = className;
		this.shift = shift;
	}

	setClassName(value) {
		this.className = value;
		this.trimClassName();
		return this;
	} 

	setShift(value) {
		this.shift = value;
		return this;
	}

	getClassName() {
		return this.className;
	}

	getShift() {
		return this.shift;
	}

	trimClassName() {
		const regexPattern = /\s+/g;
		this.className = this.className.replace(regexPattern, "");
		return this;
	}
 
	validate() {
		if (!this.className || !this.shift) return false;
		return true;
	}
}