import styles from './NecrologyScreen.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import Section from '../../atoms/Section/Section.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import HumanList from '../../organisms/HumanList/HumanList.js';
import Conditional from '../../atoms/Conditional/Conditional.js';
import Center from '../../atoms/Center/Center.js';
import ParametersOverview from '../../organisms/ParametersOverview/ParametersOverview.js';
import classNames from 'classnames';
import TreatmentCoursesOverview from '../../organisms/TreatmentCoursesOverview/TreatmentCoursesOverview.js';

NecrologyScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function NecrologyScreen({ simulation }) {
    let [selectedHuman, setSelectedHuman] = useState(null);

    let hasSelectedHuman = selectedHuman !== null && simulation.deadHumans.includes(selectedHuman);

    function selectHuman(human) {
        setSelectedHuman(human);
    }

    let sortedDeadHumans = simulation.deadHumans.sort((a, b) => b.aliveDays - a.aliveDays);

    return (
        <div className={styles.necrologyScreen}>
            <Section className={styles.deadHumanList}>
                <SectionHeader className={styles.deadHumanListHeader}>
                    <span>
                        Список умерших
                    </span>
                    <b className='mx-2'>
                        {simulation.deadHumans.length}
                    </b>
                </SectionHeader>
                <SectionBody scrollable>
                    <HumanList
                        humans={sortedDeadHumans}
                        selected={selectedHuman}
                        onSelect={selectHuman}
                        listItemContentVariant='deadHuman'
                    />
                </SectionBody>
            </Section>
            <Section className={styles.humanInfo}>
                <Conditional condition={hasSelectedHuman} fallback={<Center>Выберите умершего</Center>}>
                    <SectionHeader className={styles.humanInfoHeader}>
                        <span>
                            {selectedHuman?.fullName}
                        </span>
                    </SectionHeader>
                    <SectionBody scrollable>
                        <div className={classNames(styles.treatmentCoursesOverview, 'px-2 py-2')}>
                            <div className='px-2'>
                                <h6>Назначенные медикаменты</h6>
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
        </div>
    );
}

export default NecrologyScreen;