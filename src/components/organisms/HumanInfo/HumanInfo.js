import styles from './HumanInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human';
import ParameterInfo from '../ParameterInfo/ParameterInfo.js';

HumanInfo.propTypes = {
    human: PropTypes.instanceOf(Human),
};

function HumanInfo({human}) {

    if (!human) {
        return (
            <div className={styles.humanInfo}>
                No human
            </div>
        );
    }

    return (
        <div className={styles.humanInfo}>
            <div className={styles.humanName}>
                {human.fullName}
            </div>
            {human.parameters.children.map((p, index) => <ParameterInfo key={index} parameter={p} /> )}
        </div>
    );
}

export default HumanInfo;
