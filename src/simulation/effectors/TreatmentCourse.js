
export default class TreatmentCourse {

    #human;

    #medicationSupplier;

    #interval;

    #totalTimes;

    #remainingTimes;

    #currentDay;

    constructor(human, medicationSupplier, interval, times) {
        this.#human = human;
        this.#medicationSupplier = medicationSupplier;
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
        let medication = this.#medicationSupplier();

        this.#human.addEffector(medication);
    }

    get totalTimes() {
        return this.#totalTimes;
    }

    get appliedTimes() {
        return this.#totalTimes - this.#remainingTimes;
    }

    get shouldTake() {
        return !this.isFinished && this.#currentDay % this.#interval === 0;
    }

    get isFinished() {
        return this.#remainingTimes === 0;
    }
}
