
export default class TreatmentCourse {

    #human;

    #medicationName;

    #interval;

    #totalTimes;

    #remainingTimes;

    #currentDay;

    constructor(human, medicationName, interval, times) {
        this.#human = human;
        this.#medicationName = medicationName;
        this.#interval = interval;
        this.#totalTimes = times;
        this.#remainingTimes = times;
        this.#currentDay = 0;
    }

    update() {
        if (this.shouldTake) {
            this.applyMedication();
            this.#remainingTimes--;
        }

        this.#currentDay++;
    }

    applyMedication() {
        let medication = this.#human.simulation.createMedication(this.#medicationName);

        this.#human.addEffector(medication);
    }

    get patient() {
        return this.#human;
    }

    get medicationName() {
        return this.#medicationName;
    }

    get medicationDescriptor() {
        return this.#human.simulation.getMedicationDescriptor(this.#medicationName);
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
