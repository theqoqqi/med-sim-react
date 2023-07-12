import styles from './ParametersOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human';
import ParameterInfo from '../ParameterInfo/ParameterInfo.js';
import {Col, Row} from 'react-bootstrap';

ParametersOverview.propTypes = {
    human: PropTypes.instanceOf(Human),
};

function ParametersOverview({human}) {

    if (!human) {
        return (
            <div className={styles.parametersOverview}>
                No human
            </div>
        );
    }

    return (
        <div className={styles.parametersOverview}>
            <Row className='g-0'>
                {human.parameters.children.map((p, index) =>
                    <Col className='g-1' xs={3} key={index}>
                        <ParameterInfo parameter={p} className={styles.parameterInfo} flat />
                    </Col>
                )}
            </Row>
        </div>
    );
}

export default ParametersOverview;
