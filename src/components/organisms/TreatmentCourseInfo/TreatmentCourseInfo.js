import styles from './TreatmentCourseInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import classNames from 'classnames';
import TreatmentCourse from '../../../simulation/effectors/TreatmentCourse.js';
import 'react-step-progress-bar/styles.css';
import {ProgressBar, Step} from 'react-step-progress-bar';

TreatmentCourseInfo.propTypes = {
    className: PropTypes.any,
    course: PropTypes.instanceOf(TreatmentCourse),
};

function getStepNumberTooltip(stepNumber, interval, currentDay) {
    let stepDay = stepNumber * interval;
    let diffDays = Math.abs(currentDay - stepDay);

    if (stepDay < currentDay) {
        return `${diffDays} дн. назад`;
    }

    if (stepDay > currentDay) {
        return `через ${diffDays} дн.`;
    }

    return 'сегодня';
}

function TreatmentCourseInfo({className, course}) {

    let currentDay = course.currentDay;
    let totalDays = course.totalDays;
    let totalTimes = course.totalTimes;
    let interval = course.interval;

    let elapsedPercent = Math.min(currentDay / totalDays * 100 + 0.001, 100);
    let stepsArray = Array.from(new Array(totalTimes).keys());
    let stepTooltips = stepsArray.map(stepNumber => {
        return getStepNumberTooltip(stepNumber, interval, currentDay);
    });

    const renderTimingsTooltip = props => (
        <Tooltip {...props}>
            каждые {interval} дней, {totalTimes} раз
        </Tooltip>
    );

    const renderProgressStepTooltip = (props, index) => (
        <Tooltip {...props}>
            {stepTooltips[index]}
        </Tooltip>
    );

    // noinspection RequiredAttributes
    return (
        <div className={classNames(styles.treatmentCourseInfo, className)}>
            <div className='d-flex gap-3'>
                <div className='fw-semibold'>
                    {course.medicationDescriptor.title}
                </div>
                <OverlayTrigger overlay={renderTimingsTooltip}>
                    <div className={classNames(styles.timingsBadge, 'd-flex gap-2')}>
                        <span className='d-flex align-items-center gap-1'>
                            <span className={styles.intervalIcon}>↻</span>
                            {interval}
                        </span>
                        <span className='d-flex align-items-center gap-1'>
                            <span className={styles.timesIcon}>×</span>
                            {totalTimes}
                        </span>
                    </div>
                </OverlayTrigger>
            </div>
            <div className='m-2 mt-3'>
                <ProgressBar percent={elapsedPercent} height={8}>
                    {stepsArray.map(number => (
                        <Step key={number}>
                            {({ accomplished, index }) => (
                                <OverlayTrigger overlay={props => renderProgressStepTooltip(props, index)}>
                                    <div className={classNames(styles.progressBarStep, {
                                        [styles.accomplished]: accomplished,
                                    })}>
                                        {index + 1}
                                    </div>
                                </OverlayTrigger>
                            )}
                        </Step>
                    ))}
                </ProgressBar>
            </div>
        </div>
    );
}

export default TreatmentCourseInfo;