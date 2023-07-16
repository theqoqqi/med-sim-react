import styles from './DiseasesScreen.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import Section from '../../atoms/Section/Section.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import DiseaseList from '../../organisms/DiseaseList/DiseaseList.js';
import Conditional from '../../atoms/Conditional/Conditional.js';
import Center from '../../atoms/Center/Center.js';
import DiseaseOverview from '../../organisms/DiseaseOverview/DiseaseOverview.js';

DiseasesScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function DiseasesScreen({ simulation }) {
    let [selectedDisease, setSelectedDisease] = useState(null);

    let diseases = simulation.allDiseaseDescriptors;
    let hasSelectedDisease = selectedDisease !== null && diseases.includes(selectedDisease);

    function selectDisease(disease) {
        setSelectedDisease(disease);
    }

    let sortedDiseases = diseases.sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className={styles.diseasesScreen}>
            <Section className={styles.diseaseList}>
                <SectionHeader className={styles.diseaseListHeader}>
                    <span>
                        Список болезней
                    </span>
                    <b className='mx-2'>
                        {diseases.length}
                    </b>
                </SectionHeader>
                <SectionBody scrollable>
                    <DiseaseList
                        descriptors={sortedDiseases}
                        selected={selectedDisease}
                        onSelect={selectDisease}
                    />
                </SectionBody>
            </Section>
            <Section className={styles.diseaseInfo}>
                <Conditional condition={hasSelectedDisease} fallback={<Center>Выберите болезнь</Center>}>
                    <SectionHeader className={styles.diseaseInfoHeader}>
                        <span>
                            {selectedDisease?.title}
                        </span>
                    </SectionHeader>
                    <SectionBody scrollable>
                        <DiseaseOverview
                            simulation={simulation}
                            descriptor={selectedDisease}
                        />
                    </SectionBody>
                </Conditional>
            </Section>
        </div>
    );
}

export default DiseasesScreen;