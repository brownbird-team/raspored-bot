export default class Options {
	constructor() {
		this.filterClasses = true;
		this.filterPeriods = true;
		this.days = true;
		this.weeks = true;
		this.saveConnection = true;
	}

	setFilterClasses() {
		this.filterClasses = !this.filterClasses;
		return this;
	}

	setFilterPeriods() {
		this.filterPeriods = !this.filterPeriods;
		return this;
	}

	setDays() {
		this.days = !this.days;
		return this;
	}

	setWeeks() {
		this.weeks = !this.weeks;
		return this;
	}

	setSaveConnection() {
		this.saveConnection = !this.saveConnection;
		return this;
	}
}