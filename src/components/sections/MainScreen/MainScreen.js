import styles from './MainScreen.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import HumanList from '../../organisms/HumanList/HumanList.js';
import HumanInfo from '../../organisms/HumanInfo/HumanInfo.js';
import Conditional from '../../atoms/Conditional/Conditional.js';
import Section from '../../atoms/Section/Section.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';

MainScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function MainScreen({simulation}) {
    let [selectedHuman, setSelectedHuman] = useState();

    function selectHuman(human) {
        setSelectedHuman(human);
    }

    return (
        <div className={styles.mainScreen}>
            <Section className={styles.patientList}>
                <SectionHeader className={styles.patientListHeader}>
                    Пациенты
                </SectionHeader>
                <SectionBody>
                    <HumanList
                        humans={simulation.allHumans}
                        selected={selectedHuman}
                        onSelect={selectHuman}
                    />
                </SectionBody>
            </Section>
            <Section className={styles.patientInfo}>
                <SectionHeader className={styles.patientInfoHeader}>
                    Информация о пациенте
                </SectionHeader>
                <SectionBody scrollable>
                    <Conditional condition={selectedHuman !== null}>
                        <HumanInfo human={selectedHuman} />
                    </Conditional>
                </SectionBody>
            </Section>
        </div>
    );
}

export default MainScreen;