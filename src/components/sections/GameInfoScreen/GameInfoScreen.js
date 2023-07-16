import styles from './GameInfoScreen.module.css';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Simulation from '../../../simulation/Simulation.js';
import Section from '../../atoms/Section/Section.js';
import SectionHeader from '../../atoms/Section/SectionHeader.js';
import SectionBody from '../../atoms/Section/SectionBody.js';
import Button from '../../atoms/Button/Button.js';
import SaveManager from '../../../simulation/SaveManager.js';
import SaveList from '../../organisms/SaveList/SaveList.js';
import SaveOverview from '../../organisms/SaveOverview/SaveOverview.js';
import SimulationOverview from '../../organisms/SimulationOverview/SimulationOverview.js';
import BusyModal from '../../molecules/BusyModal/BusyModal.js';

GameInfoScreen.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
};

function GameInfoScreen({ simulation }) {

    let [saves, setSaves] = useState([]);
    let [selectedSave, setSelectedSave] = useState(null);
    let [busyState, setBusyState] = useState({});

    let hasSelectedSave = selectedSave !== null;

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        reloadSaves();
    }, []);

    function selectSave(save) {
        setSelectedSave(save);
    }

    async function reloadSaves() {
        let saves = await SaveManager.getAllSaveInfos();

        setSaves([...saves].reverse());
    }

    async function saveSimulation(simulation) {
        setBusy('Сохранение...', 'Идет сохранение. Пожалуйста, подождите...');

        await SaveManager.addSave(simulation.save());
        await reloadSaves();

        setNotBusy();
    }

    async function loadSave(saveInfo) {
        setBusy('Загрузка...', 'Идет загрузка. Пожалуйста, подождите...');

        let save = await SaveManager.getSave(saveInfo.saveId);

        simulation.load(save);
        setNotBusy();
    }

    async function removeSave(save) {
        setBusy('Удаление...', 'Идет удаление. Пожалуйста, подождите...');

        await SaveManager.removeSave(save);
        await reloadSaves();

        setSelectedSave(null);
        setNotBusy();
    }

    function setBusy(title, message) {
        setBusyState({
            isBusy: true,
            title,
            message,
        });
    }

    function setNotBusy() {
        setBusyState({
            isBusy: false,
        });
    }

    return (
        <div className={styles.gameInfoScreen}>
            <Section className={styles.saveList}>
                <SectionHeader className={styles.saveListHeader}>
                    <span>
                        Список сохранений
                    </span>
                    <b className='mx-2'>
                        {saves.length}
                    </b>
                </SectionHeader>
                <SectionBody>
                    <SaveList
                        saves={saves}
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
                    {hasSelectedSave && (
                        <Button
                            variant='success'
                            size='sm'
                            className='mx-2'
                            onClick={() => selectSave(null)}
                        >
                            Вернуться
                        </Button>
                    )}
                    {!hasSelectedSave && (
                        <Button
                            variant='success'
                            size='sm'
                            className='mx-2'
                            onClick={() => saveSimulation(simulation)}
                        >
                            Сохранить прогресс
                        </Button>
                    )}
                </SectionHeader>
                <SectionBody scrollable>
                    {hasSelectedSave && (
                        <SaveOverview
                            save={selectedSave}
                            onLoad={save => loadSave(save)}
                            onRemove={save => removeSave(save)}
                        />
                    )}
                    {!hasSelectedSave && (
                        <SimulationOverview
                            simulation={simulation}
                        />
                    )}
                </SectionBody>
            </Section>
            <BusyModal show={busyState.isBusy} {...busyState} />
        </div>
    );
}

export default GameInfoScreen;