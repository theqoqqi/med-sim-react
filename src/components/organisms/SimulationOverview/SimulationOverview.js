import styles from './SimulationOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import classNames from 'classnames';
import Button from '../../atoms/Button/Button.js';

SimulationOverview.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function SimulationOverview({ simulation }) {
    let startedAt = new Date(simulation.startedAt);

    return (
        <div className={classNames(styles.simulationOverview, 'px-2 py-2')}>
            <div className='d-flex justify-content-between'>
                <h6>
                    {simulation.title}
                </h6>
            </div>
            <div>
                Текущий день: {simulation.currentDay}
            </div>
            <div>
                Стартовое население: {simulation.allHumans.length}
            </div>
            <div>
                Текущее население: {simulation.aliveHumans.length}
            </div>
            <div>
                Дата создания: {startedAt.toLocaleString()}
            </div>
            <Button
                variant='transparent-info'
                size='sm'
                className='mx-2'
                onClick={() => console.log(simulation)}
            >
                Вывести в консоль
            </Button>
        </div>
    );
}

export default SimulationOverview;