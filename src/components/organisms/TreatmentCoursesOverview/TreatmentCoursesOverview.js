import styles from './TreatmentCoursesOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human';
import {Col, Row} from 'react-bootstrap';
import TreatmentCourseInfo from '../TreatmentCourseInfo/TreatmentCourseInfo.js';

TreatmentCoursesOverview.propTypes = {
    human: PropTypes.instanceOf(Human),
};

function TreatmentCoursesOverview({human}) {

    if (!human) {
        return (
            <div className={styles.medicationsOverview}>
                No human
            </div>
        );
    }

    return (
        <div className={styles.medicationsOverview}>
            <Row className='g-0'>
                {human.treatmentCourses.map((course, index) =>
                    <Col className='g-1' xs={3} key={index}>
                        <TreatmentCourseInfo course={course} />
                    </Col>
                )}
            </Row>
        </div>
    );
}

export default TreatmentCoursesOverview;
