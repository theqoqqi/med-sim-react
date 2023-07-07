import './App.css';
import HumanInfo from './components/organisms/HumanInfo/HumanInfo';
import {useEffect, useState} from 'react';
import Simulation from './simulation/Simulation.js';
import axios from 'axios';
import React from 'react';

function printInfo(human) {
    console.log('Полное имя:', human.fullName);

    human.parameters.forEachRecursive(parameter => {
        console.log(parameter.title, parameter.value, `(${parameter.normalRange}, ${parameter.viableRange})`);
    });
}

function printHistory(human) {
    console.log('ИСТОРИЯ ИЗМЕНЕНИЙ:', human.fullName);

    human.parameters.forEachRecursive((parameter, parameterPath) => {
        let values = human.stateHistory.map(parameters => parameters.getParameterValue(parameterPath));

        console.log(parameter.title, values);
    });
}

async function readJson(url) {
    let data = (await axios.get(url)).data;

    return typeof data === 'string' ? JSON.parse(data) : data;
}

function App() {
    const forceUpdate = React.useReducer(() => ({}))[1];

    let [simulation, setSimulation] = useState();
    let [human, setHuman] = useState();

    useEffect(() => {
        (async () => {
            let parameterDescriptors = await readJson('./data/parameter-descriptors.json');
            let diseaseDescriptors = await readJson('./data/disease-descriptors.json');

            let simulation = new Simulation({
                parameterDescriptors,
                diseaseDescriptors,
            });

            simulation.populate(1);

            let human = simulation.allHumans[0];

            printInfo(human);
            printHistory(human);
            console.log(human);

            setHuman(human);
            setSimulation(simulation);
        })();
    }, []);

    function nextDay() {
        simulation.update();
        forceUpdate();
    }

    return (
        <div className='App'>
            <button onClick={() => nextDay()}>
                Следующий день
            </button>
            <HumanInfo human={human} />
        </div>
    );
}

export default App;
