
export default class TreatmentCourse {

    #patient;

    #medicationName;

    #interval;

    #totalTimes;

    #remainingTimes;

    #currentDay;

    constructor({ medicationName, interval, totalTimes, remainingTimes = null, currentDay = 0 }) {
        this.#patient = null;
        this.#medicationName = medicationName;
        this.#interval = interval;
        this.#totalTimes = totalTimes;
        this.#remainingTimes = remainingTimes ?? totalTimes;
        this.#currentDay = currentDay;
    }

    setPatient(patient) {
        this.#patient = patient;
    }

    update() {
        if (this.shouldTake) {
            this.applyMedication();
            this.#remainingTimes--;
        }

        this.#currentDay++;
    }

    applyMedication() {
        let medication = this.#patient.simulation.createMedication(this.#medicationName);

        this.#patient.addEffector(medication);
    }

    get patient() {
        return this.#patient;
    }

    get medicationName() {
        return this.#medicationName;
    }

    get medicationDescriptor() {
        return this.#patient.simulation.getMedicationDescriptor(this.#medicationName);
    }

    get interval() {
        return this.#interval;
    }

    get totalTimes() {
        return this.#totalTimes;
    }

    get appliedTimes() {
        return this.#totalTimes - this.#remainingTimes;
    }

    get remainingTimes() {
        return this.#remainingTimes;
    }

    get currentDay() {
        return this.#currentDay;
    }

    get totalDays() {
        return (this.#totalTimes - 1) * this.#interval;
    }

    get shouldTake() {
        return !this.isFinished && this.#currentDay % this.#interval === 0;
    }

    get isFinished() {
        return this.#remainingTimes === 0;
    }

    toJson() {
        return {
            medicationName: this.medicationName,
            interval: this.interval,
            totalTimes: this.totalTimes,
            remainingTimes: this.remainingTimes,
            currentDay: this.currentDay,
        };
    }

    static fromJson(json) {
        return new TreatmentCourse(json);
    }
}
