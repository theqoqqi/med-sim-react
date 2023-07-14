
export default class TreatmentCourse {

    #patient;

    #medicationName;

    #interval;

    #totalIntakes;

    #remainingIntakes;

    #currentDay;

    constructor({ medicationName, interval, totalIntakes, remainingIntakes = null, currentDay = 0 }) {
        this.#patient = null;
        this.#medicationName = medicationName;
        this.#interval = interval;
        this.#totalIntakes = totalIntakes;
        this.#remainingIntakes = remainingIntakes ?? totalIntakes;
        this.#currentDay = currentDay;
    }

    setPatient(patient) {
        this.#patient = patient;
    }

    update() {
        if (this.shouldTake) {
            this.applyMedication();
            this.#remainingIntakes--;
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

    get totalIntakes() {
        return this.#totalIntakes;
    }

    get appliedIntakes() {
        return this.#totalIntakes - this.#remainingIntakes;
    }

    get remainingIntakes() {
        return this.#remainingIntakes;
    }

    get currentDay() {
        return this.#currentDay;
    }

    get totalDays() {
        return (this.#totalIntakes - 1) * this.#interval;
    }

    get shouldTake() {
        return !this.isFinished && this.#currentDay % this.#interval === 0;
    }

    get isFinished() {
        return this.#remainingIntakes === 0;
    }

    toJson() {
        return {
            medicationName: this.medicationName,
            interval: this.interval,
            totalIntakes: this.totalIntakes,
            remainingIntakes: this.remainingIntakes,
            currentDay: this.currentDay,
        };
    }

    static fromJson(json) {
        return new TreatmentCourse(json);
    }
}
