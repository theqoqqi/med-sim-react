import styles from './App.module.css';
import React, {useEffect, useState} from 'react';
import Simulation from './simulation/Simulation.js';
import axios from 'axios';
import {Container, Nav, Tab} from 'react-bootstrap';
import classNames from 'classnames';
import PatientsScreen from './components/sections/PatientsScreen/PatientsScreen.js';
import Button from './components/atoms/Button/Button.js';
import NecrologyScreen from './components/sections/NecrologyScreen/NecrologyScreen.js';

async function readJson(url) {
    let data = (await axios.get(url)).data;

    return typeof data === 'string' ? JSON.parse(data) : data;
}

const UPDATE_RATE_MS = 200;

function App() {
    const forceUpdate = React.useReducer(() => ({}))[1];

    let [simulation, setSimulation] = useState(null);

    useEffect(() => {
        (async () => {
            let parameterDescriptors = await readJson('./data/parameter-descriptors.json');
            let diseaseDescriptors = await readJson('./data/disease-descriptors.json');

            let simulation = new Simulation({
                parameterDescriptors,
                diseaseDescriptors,
            });

            simulation.populate(1000);

            setSimulation(simulation);

            setInterval(() => {
                forceUpdate();
            }, UPDATE_RATE_MS);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function nextDay() {
        simulation.update();
    }

    if (!simulation) {
        return (
            <div className='vw-100 vh-100 d-flex justify-content-center align-items-center'>
                <h3>
                    Подготовка симуляции...
                </h3>
            </div>
        );
    }

    let currentDay = simulation.currentDay;
    let patientCount = simulation.allPatients.length;
    let aliveCount = simulation.aliveHumans.length;
    let newDeaths = simulation.deadHumans.filter(h => h.aliveDays === currentDay).length;

    return (
        <Container className={classNames(styles.app, 'g-0')}>
            <Tab.Container defaultActiveKey='patients'>
                <div className={classNames(styles.tabs, 'd-flex justify-content-sm-between p-2')}>
                    <Nav variant='underline'>
                        <Nav.Link eventKey='patients'>
                            Пациенты ({patientCount})
                        </Nav.Link>
                        <Nav.Link eventKey='necrology'>
                            Умершие
                            {newDeaths > 0 && ` (+${newDeaths})`}
                        </Nav.Link>
                    </Nav>
                    <div className={styles.simulationStats}>
                        <div className='d-flex flex-column me-3 text-end'>
                            <small>День: <b>{currentDay}</b></small>
                            <small>Людей: <b>{aliveCount}</b></small>
                        </div>
                        <Button variant='primary' onClick={() => nextDay()}>
                            Следующий день
                        </Button>
                    </div>
                </div>
                <Tab.Content className='flex-grow-1'>
                    <Tab.Pane className='flex-grow-1' eventKey='patients'>
                        <PatientsScreen simulation={simulation} />
                    </Tab.Pane>
                    <Tab.Pane className='flex-grow-1' eventKey='necrology'>
                        <NecrologyScreen simulation={simulation} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
}

export default App;
