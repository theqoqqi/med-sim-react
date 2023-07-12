import styles from './MedicationInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Col, Row} from 'react-bootstrap';
import Simulation from '../../../simulation/Simulation.js';
import DiseaseSource from '../../../simulation/effectors/diseases/DiseaseSource.js';
import NumberRange from '../../../simulation/utils/NumberRange.js';

MedicationInfo.propTypes = {
    descriptor: PropTypes.object,
    simulation: PropTypes.instanceOf(Simulation),
};

function MedicationInfo({descriptor, simulation}) {

    let sourceImpacts = Object.entries(descriptor.sourceEffects).map(([sourceName, value]) => {
        let title = DiseaseSource.byName(sourceName).title;

        return {sourceName, title, value};
    });

    let parameterImpacts = simulation.mapParameterEffects(descriptor.effects, (parameterPath, value) => {
        let title = simulation.getParameterTitle(parameterPath);

        return {parameterPath, title, value};
    });

    let progressPerDayRange = NumberRange.from(descriptor.progressPerDay);
    let averageProgressPerDay = progressPerDayRange.average;
    let averageDays = 1 / averageProgressPerDay;

    function getValueSignIcon(value) {
        return value > 0
            ? <span style={{color: 'limegreen'}}>▲</span>
            : <span style={{color: 'deepskyblue'}}>▼</span>;
    }

    return (
        <div className={classNames(styles.medicationInfo)}>
            <Row>
                <Col>
                    <div>
                        {descriptor.title}
                    </div>
                    <small className='opacity-75'>
                        Действует около {averageDays.toFixed(1)} дней
                        {' '}
                        <small style={{fontSize: 11}}>
                            ({descriptor.impactFunction})
                        </small>
                    </small>
                </Col>
                <Col>
                    <div className={classNames(styles.effectList, 'd-flex flex-column')}>
                        {sourceImpacts.map(({ sourceName, title, value }) => (
                            <div key={sourceName}>
                                {title}: {getValueSignIcon(-value)} {value}
                            </div>
                        ))}
                        {parameterImpacts.map(({ parameterPath, title, value }) => (
                            <div key={parameterPath}>
                                {title}: {getValueSignIcon(value)} {Math.abs(value)}
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default MedicationInfo;