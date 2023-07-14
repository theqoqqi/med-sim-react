import styles from './GameInfoScreen.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import Section from '../../atoms/Section/Section.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import Button from '../../atoms/Button/Button.js';
import SaveManager from '../../../simulation/SaveManager.js';
import SaveList from '../../organisms/SaveList/SaveList.js';
import SaveOverview from '../../organisms/SaveOverview/SaveOverview.js';

GameInfoScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function GameInfoScreen({ simulation }) {

    let [selectedSave, setSelectedSave] = useState(null);

    let hasSelectedSave = selectedSave !== null;
    let allSaves = SaveManager.getAllSaves().reverse();
    let simulationJson = simulation.save();

    function selectSave(save) {
        setSelectedSave(save.saveId === selectedSave?.saveId ? null : save);
    }

    function saveSimulation(simulation) {
        SaveManager.addSave(simulation.save());
    }

    function loadSave(save) {
        simulation.load(save);
    }

    function removeSave(save) {
        SaveManager.removeSave(save);
        setSelectedSave(null);
    }

    return (
        <div className={styles.gameInfoScreen}>
            <Section className={styles.saveList}>
                <SectionHeader className={styles.saveListHeader}>
                    <span>
                        Список сохранений
                    </span>
                    <b className='mx-2'>
                        {allSaves.length}
                    </b>
                </SectionHeader>
                <SectionBody>
                    <SaveList
                        saves={allSaves}
                        selected={selectedSave}
                        onSelect={save => selectSave(save)}
                    />
                </SectionBody>
            </Section>
            <Section className={styles.saveListItem}>
                <SectionHeader className={styles.saveListItemHeader}>
                    <span>
                        {hasSelectedSave ? 'Информация о сохранении' : 'Информация о текущей игре'}
                    </span>
                    <Button
                        variant='success'
                        size='sm'
                        className='mx-2'
                        onClick={() => saveSimulation(simulation)}
                    >
                        Сохранить прогресс
                    </Button>
                </SectionHeader>
                <SectionBody scrollable>
                    <SaveOverview
                        save={selectedSave ?? simulationJson}
                        onLoad={save => loadSave(save)}
                        onRemove={save => removeSave(save)}
                    />
                </SectionBody>
            </Section>
        </div>
    );
}

export default GameInfoScreen;