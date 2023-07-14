import Effector from '../Effector.js';

export default class Disease extends Effector {

    #sourcePowers;

    #maxPower;

    constructor({ sourcePowers, maxPower = null, ...options }) {
        super(options);

        this.#sourcePowers = Disease.#createPowerMap(sourcePowers);
        this.#maxPower = maxPower ?? Disease.#getSumOfPowers(this.#sourcePowers);
    }

    get #currentPower() {
        return Disease.#getSumOfPowers(this.#sourcePowers);
    }

    get impactMultiplier() {
        return this.#currentPower / this.#maxPower;
    }

    get sourcePowers() {
        return this.#sourcePowers;
    }

    cureSource(sourceName, cureBy) {
        let oldPower = this.getSourcePower(sourceName);
        let newPower = oldPower - cureBy;

        this.setSourcePower(sourceName, newPower);
    }

    setSourcePower(sourceName, power) {
        this.#sourcePowers.set(sourceName, Math.max(0, power));
    }

    getSourcePower(sourceName) {
        return this.#sourcePowers.has(sourceName)
            ? this.#sourcePowers.get(sourceName)
            : 0;
    }

    static #createPowerMap(sourcePowers) {
        return Object.entries(sourcePowers)
            .reduce((map, [sourceName, power]) => map.set(sourceName, power), new Map());
    }

    static #getSumOfPowers(sourcePowers) {
        return Array.from(sourcePowers.values())
            .reduce((sum, current) => sum + current, 0);
    }

    toJson() {
        return {
            ...super.toJson(),
            sourcePowers: Object.fromEntries(this.#sourcePowers),
            maxPower: this.#maxPower,
        };
    }

    static fromJson(json) {
        return new Disease(json);
    }
}