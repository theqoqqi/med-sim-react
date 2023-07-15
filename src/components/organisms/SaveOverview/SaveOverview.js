import styles from './SaveOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../atoms/Button/Button.js';
import classNames from 'classnames';

SaveOverview.propTypes = {
    save: PropTypes.object,
    onLoad: PropTypes.func,
    onRemove: PropTypes.func,
};

function SaveOverview({ save, onLoad, onRemove }) {
    let savedAt = new Date(save.savedAt);
    let startedAt = new Date(save.startedAt);

    return (
        <div className={classNames(styles.saveOverview, 'px-2 py-2')}>
            <div className='d-flex justify-content-between'>
                <h6>
                    {save.title}
                </h6>
                <div className='d-flex gap-2'>
                    <Button
                        variant='transparent-danger'
                        size='sm'
                        className='mx-2'
                        onClick={() => onRemove(save)}
                    >
                        Удалить сохранение
                    </Button>
                    <Button
                        variant='primary'
                        size='sm'
                        className='mx-2'
                        onClick={() => onLoad(save)}
                    >
                        Загрузить сохранение
                    </Button>
                </div>
            </div>
            <div>
                Текущий день: {save.currentDay}
            </div>
            <div>
                Стартовое население: {save.totalHumans}
            </div>
            <div>
                Текущее население: {save.aliveHumans}
            </div>
            <div>
                Дата создания: {startedAt.toLocaleString()}
            </div>
            <div>
                Дата сохранения: {savedAt.toLocaleString()}
            </div>
            <Button
                variant='transparent-info'
                size='sm'
                className='mx-2'
                onClick={() => console.log(save)}
            >
                Вывести в консоль
            </Button>
        </div>
    );
}

export default SaveOverview;