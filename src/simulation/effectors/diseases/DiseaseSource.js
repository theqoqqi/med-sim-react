export default class DiseaseSource {

    static #allSources = new Map([
        ['viralInfection', new DiseaseSource('viralInfection', 'Вирусная инфекция')],
        ['bacterialInfection', new DiseaseSource('bacterialInfection', 'Бактериальная инфекция')],
        ['inflammatory', new DiseaseSource('inflammatory', 'Воспалительный процесс')],
        ['autoimmuneDisorders', new DiseaseSource('autoimmuneDisorders', 'Аутоиммунное расстройство')],
        ['geneticDisorders', new DiseaseSource('geneticDisorders', 'Генетические расстройство')],
    ]);

    #name;

    #title;

    constructor(name, title) {
        this.#name = name;
        this.#title = title;
    }

    get name() {
        return this.#name;
    }

    get title() {
        return this.#title;
    }

    static byName(name) {
        if (this.#allSources.has(name)) {
            throw new Error(`Disease source "${name}" not exists`);
        }

        return this.#allSources.get(name);
    }
}