import styles from './TreatmentCourseInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import classNames from 'classnames';
import TreatmentCourse from '../../../simulation/effectors/TreatmentCourse.js';

TreatmentCourseInfo.propTypes = {
    course: PropTypes.instanceOf(TreatmentCourse),
};

function TreatmentCourseInfo({course}) {

    const renderTooltip = props => (
        <Tooltip id='button-tooltip' {...props}>
            каждые {course.interval} дней, {course.totalTimes} раз
        </Tooltip>
    );

    // noinspection RequiredAttributes
    return (
        <div className={styles.treatmentCourseInfo}>
            <div className='d-flex gap-3'>
                <div className='fw-semibold'>
                    {course.medicationDescriptor.title}
                </div>
                <OverlayTrigger overlay={renderTooltip}>
                    <div className={classNames(styles.timingsBadge, 'd-flex gap-2')}>
                        <span className='d-flex align-items-center gap-1'>
                            <span className={styles.intervalIcon}>↻</span>
                            {course.interval}
                        </span>
                        <span className='d-flex align-items-center gap-1'>
                            <span className={styles.timesIcon}>×</span>
                            {course.totalTimes}
                        </span>
                    </div>
                </OverlayTrigger>
            </div>
        </div>
    );
}

export default TreatmentCourseInfo;