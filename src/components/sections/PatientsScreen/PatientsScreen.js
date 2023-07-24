import styles from './PatientsScreen.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import HumanList from '../../organisms/HumanList/HumanList.js';
import ParametersOverview from '../../organisms/ParametersOverview/ParametersOverview.js';
import Conditional from '../../atoms/Conditional/Conditional.js';
import Section from '../../atoms/Section/Section.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';
import Center from '../../atoms/Center/Center.js';
import Button from '../../atoms/Button/Button.js';
import TreatmentCoursesOverview from '../../organisms/TreatmentCoursesOverview/TreatmentCoursesOverview.js';
import CreateTreatmentCourseModal from '../../organisms/CreateTreatmentCourseModal/CreateTreatmentCourseModal.js';
import classNames from 'classnames';
import AutoHeightTextarea from '../../atoms/AutoHeightTextarea/AutoHeightTextarea.js';

PatientsScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function PatientsScreen({ simulation }) {
    let [selectedHuman, setSelectedHuman] = useState(null);
    let [isAssigningTreatment, setAssigningTreatment] = useState(false);
    let [notes, setNotes] = useState('');

    let hasSelectedHuman = selectedHuman !== null && simulation.allPatients.includes(selectedHuman);

    function onEditNotes(notes) {
        selectedHuman.setNotes(notes);
        setNotes(notes);
    }

    function selectHuman(human) {
        setSelectedHuman(human);
        setNotes(human.notes ?? '');
    }

    function freePatient(human) {
        simulation.removePatient(human);
        selectFirstPatient();
    }

    function showAssignTreatmentModal() {
        setAssigningTreatment(true);
    }

    function hideAssignTreatmentModal() {
        setAssigningTreatment(false);
    }

    function assignTreatment(course) {
        selectedHuman.addTreatmentCourse(course);
        hideAssignTreatmentModal();
    }

    function selectFirstPatient() {
        if (simulation.allPatients.length) {
            setSelectedHuman(simulation.allPatients[0]);
        }
    }

    return (
        <div className={styles.patientsScreen}>
            <Section className={styles.patientList}>
                <SectionHeader className={styles.patientListHeader}>
                    <span>
                        Список пациентов
                    </span>
                    <b className='mx-2'>
                        {simulation.allPatients.length}
                    </b>
                </SectionHeader>
                <SectionBody scrollable>
                    <HumanList
                        humans={simulation.allPatients}
                        selected={selectedHuman}
                        onSelect={selectHuman}
                        listItemContentVariant='aliveHuman'
                    />
                </SectionBody>
            </Section>
            <Section className={styles.patientInfo}>
                <Conditional condition={hasSelectedHuman} fallback={<Center>Выберите пациента</Center>}>
                    <SectionHeader className={styles.patientInfoHeader}>
                        <span>
                            {selectedHuman?.fullName}
                        </span>
                        <Button
                            variant='success'
                            size='sm'
                            className='mx-2'
                            onClick={() => freePatient(selectedHuman)}
                        >
                            Отправить домой
                        </Button>
                    </SectionHeader>
                    <SectionBody scrollable>
                        <div className={classNames(styles.notes)}>
                            <AutoHeightTextarea
                                className={styles.noteTextarea}
                                value={notes}
                                onChange={e => onEditNotes(e.target.value)}
                                placeholder='Заметок нет'
                            />
                        </div>
                        <div className={classNames(styles.treatmentCoursesOverview, 'px-2 py-2')}>
                            <div className='d-flex justify-content-between align-items-center px-2'>
                                <h6>Назначенные медикаменты</h6>
                                <Button
                                    variant='primary'
                                    size='sm'
                                    className=''
                                    onClick={() => showAssignTreatmentModal()}
                                >
                                    Назначить
                                </Button>
                            </div>
                            <TreatmentCoursesOverview human={selectedHuman} />
                        </div>
                        <div className='px-3 pt-2'>
                            <h6>Результаты анализов</h6>
                        </div>
                        <ParametersOverview human={selectedHuman} />
                    </SectionBody>
                </Conditional>
            </Section>
            <CreateTreatmentCourseModal
                simulation={simulation}
                patient={selectedHuman}
                visible={isAssigningTreatment}
                onCancel={() => hideAssignTreatmentModal()}
                onCreate={course => assignTreatment(course)}
            />
        </div>
    );
}

export default PatientsScreen;