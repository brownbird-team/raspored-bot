export default class TableContent {

	constructor(id=null, classes=null) {
		this.id = id;
		this.classes = classes;
	}

	setId(value) {
		this.id = value;
		return this;
	}

	setClasses(value) {
		this.classes = value;
		return this;
	}

	getId() {
		return this.id;
	}

	getClasses() {
		return this.classes;
	}
}