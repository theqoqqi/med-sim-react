import styles from './PatientsScreen.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import HumanList from '../../organisms/HumanList/HumanList.js';
import HumanInfo from '../../organisms/HumanInfo/HumanInfo.js';
import Conditional from '../../atoms/Conditional/Conditional.js';
import Section from '../../atoms/Section/Section.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';
import Center from '../../atoms/Center/Center.js';
import Button from '../../atoms/Button/Button.js';

PatientsScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function PatientsScreen({simulation}) {
    let [selectedHuman, setSelectedHuman] = useState(null);

    let hasSelectedHuman = selectedHuman !== null && simulation.allPatients.includes(selectedHuman);

    function selectHuman(human) {
        setSelectedHuman(human);
    }

    function freePatient(human) {
        simulation.removePatient(human);
        selectFirstPatient();
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
                <SectionBody>
                    <HumanList
                        humans={simulation.allPatients}
                        selected={selectedHuman}
                        onSelect={selectHuman}
                    />
                </SectionBody>
            </Section>
            <Section className={styles.patientInfo}>
                <SectionHeader className={styles.patientInfoHeader}>
                    <span>
                        Информация о пациенте
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
                    <Conditional condition={hasSelectedHuman} fallback={<Center>Выберите пациента</Center>}>
                        <HumanInfo human={selectedHuman} />
                    </Conditional>
                </SectionBody>
            </Section>
        </div>
    );
}

export default PatientsScreen;