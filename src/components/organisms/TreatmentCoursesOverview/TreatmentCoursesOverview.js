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
            <Row>
                {human.treatmentCourses.length === 0 && (
                    <Col xs={12} className='text-muted'>
                        Ничего не назначено
                    </Col>
                )}
                {human.treatmentCourses.map((course, index) =>
                    <Col xs={4} key={index}>
                        <TreatmentCourseInfo course={course} className={styles.treatmentCourseInfo} />
                    </Col>
                )}
            </Row>
        </div>
    );
}

export default TreatmentCoursesOverview;
