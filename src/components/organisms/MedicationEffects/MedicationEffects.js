import styles from './MedicationEffects.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DiseaseSource from '../../../simulation/effectors/diseases/DiseaseSource.js';
import Simulation from '../../../simulation/Simulation.js';
import Human from '../../../simulation/humans/Human.js';

MedicationEffects.propTypes = {
    descriptor: PropTypes.object,
    simulation: PropTypes.instanceOf(Simulation),
    patient: PropTypes.instanceOf(Human),
};

function MedicationEffects({ descriptor, simulation, patient }) {
    let colorizeSources = false;

    let sourceImpacts = Object.entries(descriptor.sourceEffects ?? {}).map(([sourceName, value]) => {
        let title = DiseaseSource.byName(sourceName).title;

        return { sourceName, title, value };
    });

    let parameterImpacts = simulation.flattenParameterEffectImpacts(descriptor.effects, (value, parameterPath) => {
        let title = simulation.getParameterTitle(parameterPath);

        return { parameterPath, title, value };
    });

    function getValueSignIcon(value) {
        return value > 0
            ? <span style={{ color: 'limegreen' }}>▲</span>
            : <span style={{ color: 'deepskyblue' }}>▼</span>;
    }

    function getImpactClassForSource(sourceName, impactValue) {
        if (!colorizeSources || !patient) {
            return getImpactClass(0);
        }

        let oldSourcePower = patient.getMaxDiseaseSourcePower(sourceName);
        let newSourcePower = Math.max(0, oldSourcePower + impactValue);

        return getImpactClass(oldSourcePower - newSourcePower);
    }

    function getImpactClassForParameter(parameterPath, impactValue) {
        if (!patient) {
            return getImpactClass(0);
        }

        let parameter = patient.getParameter(parameterPath);
        let oldValue = parameter.value;
        let newValue = oldValue + impactValue;

        let oldDistance = parameter.normalRange.getDistance(oldValue);
        let newDistance = parameter.normalRange.getDistance(newValue);

        return getImpactClass(oldDistance - newDistance);
    }

    function getImpactClass(impactPositivity) {
        if (!patient) {
            return null;
        }

        if (impactPositivity === 0) {
            return styles.neutral;
        }

        return impactPositivity > 0 ? styles.positive : styles.negative;
    }

    return (
        <div className={styles.medicationEffects}>
            {sourceImpacts.map(({ sourceName, title, value }) => (
                <div
                    key={sourceName}
                    className={classNames(
                        styles.effect,
                        styles.sourceEffect,
                        getImpactClassForSource(sourceName, -value)
                    )}
                >
                    🛡️ {title}: {getValueSignIcon(-value)} {value}
                </div>
            ))}
            {parameterImpacts.map(({ parameterPath, title, value }) => (
                <div
                    key={parameterPath}
                    className={classNames(
                        styles.effect,
                        styles.parameterEffect,
                        getImpactClassForParameter(parameterPath, value)
                    )}
                >
                    {title}: {getValueSignIcon(value)} {Math.abs(value)}
                </div>
            ))}
        </div>
    );
}

export default MedicationEffects;