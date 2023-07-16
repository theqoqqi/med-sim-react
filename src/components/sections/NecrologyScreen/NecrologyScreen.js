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

NecrologyScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function NecrologyScreen({simulation}) {
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
                        listItemContent={human => (
                            <div className='d-flex flex-column'>
                                <span>{human.fullName}</span>
                                <div className='d-flex justify-content-between'>
                                    <small>{human.lethalParameter.title}</small>
                                    <small>{human.aliveDays} день</small>
                                </div>
                            </div>
                        )}
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
                        <ParametersOverview human={selectedHuman} />
                    </SectionBody>
                </Conditional>
            </Section>
        </div>
    );
}

export default NecrologyScreen;