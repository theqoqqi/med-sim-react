
export default class TreatmentCourse {

    #patient;

    #medicationName;

    #interval;

    #totalTimes;

    #remainingTimes;

    #currentDay;

    constructor(medicationName, interval, times) {
        this.#patient = null;
        this.#medicationName = medicationName;
        this.#interval = interval;
        this.#totalTimes = times;
        this.#remainingTimes = times;
        this.#currentDay = 0;
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
}
