
import axios from 'axios';
import ParameterFactory from './simulation/parameters/ParameterFactory.js';
import Human from './simulation/humans/Human.js';
import Name from './simulation/humans/Name.js';
import DiseaseFactory from './simulation/effectors/DiseaseFactory.js';

init();

async function init() {
    let parameterDescriptors = await readJson('./data/parameter-descriptors.json');
    let parameterFactory = new ParameterFactory(parameterDescriptors);

    let diseaseDescriptors = await readJson('./data/disease-descriptors.json');
    let diseaseFactory = new DiseaseFactory(diseaseDescriptors);

    let parameters = parameterFactory.createParameters();
    let personName = Name.from('Иванов Иван Иванович');
    let human = new Human(personName, parameters);

    let diseases = diseaseFactory.createRandomSet(human);
    let randomSets = new Array(1000)
        .fill(0)
        .map(() => diseaseFactory.createRandomSet(human))
        .filter(s => s.length > 0);

    console.log(diseases, randomSets);

    printInfo(human);

    human.addDiseases(diseases);

    for (let i = 0; i < 30; i++) {
        human.update();
    }

    printHistory(human);
}

function printInfo(human) {
    console.log('Полное имя:', human.fullName);

    human.parameters.forEachParameter((parameterPath, parameter) => {
        console.log(parameter.title, parameter.value, `(${parameter.normalRange}, ${parameter.viableRange})`);
    });
}

function printHistory(human) {
    console.log('ИСТОРИЯ ИЗМЕНЕНИЙ:', human.fullName);

    human.parameters.forEachParameter((parameterPath, parameter) => {
        let values = human.stateHistory.map(parameters => parameters.getParameterValue(parameterPath));

        console.log(parameter.title, values);
    });
}

async function readJson(url) {
    let data = (await axios.get(url)).data;

    return typeof data === 'string' ? JSON.parse(data) : data;
}