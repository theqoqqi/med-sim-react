import styles from './HumanInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human';
import ParameterInfo from '../ParameterInfo/ParameterInfo.js';
import {Col, Row} from 'react-bootstrap';

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
            <Row className='g-0'>
                {human.parameters.children.map((p, index) =>
                    <Col className='g-1' xs={3} key={index}>
                        <ParameterInfo parameter={p} flat />
                    </Col>
                )}
            </Row>
        </div>
    );
}

export default HumanInfo;
