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
import {Form} from 'react-bootstrap';

DiseasesScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function DiseasesScreen({ simulation }) {
    let [selectedDisease, setSelectedDisease] = useState(null);
    let [selectedParameter, setSelectedParameter] = useState('');

    let allDiseases = simulation.allDiseaseDescriptors;
    let hasSelectedDisease = selectedDisease !== null && allDiseases.includes(selectedDisease);

    let visibleDiseases = allDiseases
        .filter(disease => !selectedParameter || affectsParameter(disease, selectedParameter))
        .sort((a, b) => b.chancePerDay - a.chancePerDay);

    function affectsParameter(disease, parameterPath) {
        return simulation
            .flattenParameterEffectImpacts(disease.effects, (impact, parameterPath) => {
                return parameterPath;
            })
            .includes(parameterPath);
    }

    function mapParameterGroups(callback) {
        return Object.entries(simulation.parameterSetDescriptor.parameters)
            .filter(([parameterName]) => parameterName !== 'physical')
            .map(([parameterName, compositeParameter]) => {
                let flatten = simulation.flattenParameterDescriptors(compositeParameter, parameterName);

                return callback(parameterName, flatten);
            });
    }

    return (
        <div className={styles.diseasesScreen}>
            <Section className={styles.diseaseList}>
                <SectionHeader className={styles.diseaseListHeader}>
                    <span>
                        Список болезней
                    </span>
                    <b className='mx-2'>
                        {allDiseases.length}
                    </b>
                </SectionHeader>
                <SectionBody scrollable>
                    <DiseaseList
                        descriptors={visibleDiseases}
                        selected={selectedDisease}
                        onSelect={setSelectedDisease}
                    />
                </SectionBody>
            </Section>
            <Section className={styles.diseaseInfo}>
                <SectionHeader className={styles.diseaseInfoHeader}>
                    <span>
                        {selectedDisease?.title}
                    </span>
                    <div>
                        <Form.Select value={selectedParameter} onChange={e => setSelectedParameter(e.target.value)}>
                            <option value=''>
                                Без фильтра
                            </option>
                            {mapParameterGroups((groupName, parameters) => (
                                <optgroup key={groupName} label={simulation.getParameterTitle(groupName)}>
                                    {parameters.map(parameter => (
                                        <option key={parameter.name} value={parameter.name}>
                                            {parameter.title}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </Form.Select>
                    </div>
                </SectionHeader>
                <SectionBody scrollable>
                    <Conditional condition={hasSelectedDisease} fallback={<Center>Выберите болезнь</Center>}>
                        <DiseaseOverview
                            simulation={simulation}
                            descriptor={selectedDisease}
                        />
                    </Conditional>
                </SectionBody>
            </Section>
        </div>
    );
}

export default DiseasesScreen;