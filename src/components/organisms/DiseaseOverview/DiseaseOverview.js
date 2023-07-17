import styles from './DiseaseOverview.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import NumberRange from '../../../simulation/utils/NumberRange.js';
import classNames from 'classnames';
import DiseaseSource from '../../../simulation/effectors/diseases/DiseaseSource.js';
import Simulation from '../../../simulation/Simulation.js';

DiseaseOverview.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
    descriptor: PropTypes.object,
};

function getRangeByValue(value, mappings) {
    const rangeMap = new Map(mappings);

    for (const [bound, range] of rangeMap) {
        if (value <= bound || bound === null) {
            return range;
        }
    }
}

function Field({ title, value, separator = ': ' }) {
    return (
        <div>
            <span className='text-muted'>
                {title}
                {separator}
            </span>
            <span className='fw-semibold'>
                {value}
            </span>
        </div>
    );
}

function coloredSpan(text, color) {
    return <span style={{ color }}>{text}</span>
}

function DiseaseOverview({ simulation, descriptor }) {

    let sourceTitles = Object.keys(descriptor.sourcePowers)
        .map(sourceName => DiseaseSource.byName(sourceName))
        .map(source => source.title);
    let monthlyRatePerMillionHumans = descriptor.chancePerDay * 1000000 * 30;
    let daysToProgress = 1 / NumberRange.from(descriptor.progressPerDay).average;
    let effects = simulation.flattenParameterEffectImpacts(descriptor.effects, (value, parameterPath) => {
        let title = simulation.getParameterTitle(parameterPath);

        return { parameterPath, title, value };
    });

    let difficulty = getDifficulty(descriptor.sourcePowers);
    let severity = getSeverity(effects);

    effects.sort((a, b) => {
        let severityA = getEffectSeverity(a);
        let severityB = getEffectSeverity(b);

        return severityB - severityA;
    });

    function getDifficultyTitle(difficulty) {
        return getRangeByValue(difficulty, [
            [1, coloredSpan('Очень низкая', '#4e7900')],
            [2.5, coloredSpan('Низкая', '#7c8f0e')],
            [4.5, coloredSpan('Средняя', '#b4800d')],
            [7, coloredSpan('Высокая', '#c03500')],
            [10, coloredSpan('Очень высокая', '#a60000')],
            [null, coloredSpan('Неизлечимая', '#646464')],
        ]);
    }

    function getSeverityTitle(severity) {
        return getRangeByValue(severity, [
            [1, coloredSpan('Очень легкая', '#4e7900')],
            [2.5, coloredSpan('Легкая', '#7c8f0e')],
            [4.5, coloredSpan('Средняя', '#b4800d')],
            [7, coloredSpan('Тяжелая', '#c03500')],
            [10, coloredSpan('Очень тяжелая', '#a60000')],
            [null, coloredSpan('Невыносимая', '#646464')],
        ]);
    }

    function getImpactFunctionTitle(impactFunction) {
        let map = {
            inverseLinear: coloredSpan('inverseLinear', '#4e7900'),
            gaussian: coloredSpan('gaussian', '#7c8f0e'),
            power: coloredSpan('power', '#b4800d'),
            squareRoot: coloredSpan('squareRoot', '#c03500'),
            linear: coloredSpan('linear', '#a60000'),
            quadratic: coloredSpan('quadratic', '#880039'),
        };

        return map[impactFunction];
    }

    function getDifficulty(sourcePowers) {
        return Object.values(sourcePowers)
            .reduce((sum, power) => sum + power, 0);
    }

    function getSeverity(effects) {
        return effects
            .map(getEffectSeverity)
            .reduce((sum, power) => sum + power, 0);
    }

    function getEffectSeverity({ parameterPath, value }) {
        let parameterDescriptor = simulation.getParameterDescriptor(parameterPath);
        let viableRange = NumberRange.from(parameterDescriptor.viableRange);
        let lethalRange = NumberRange.from(parameterDescriptor.lethalRange);
        let normalRange = NumberRange.from(parameterDescriptor.normalRange);
        let absValue = Math.abs(value);
        let checkRange = lethalRange
            ? NumberRange.lerp(viableRange, lethalRange, 0.5)
            : viableRange;

        let distanceToLethal = value > 0
            ? checkRange.max - normalRange.max
            : normalRange.min - checkRange.min;

        return absValue / distanceToLethal;
    }

    function getEffectColor(effect) {
        let severity = getEffectSeverity(effect);

        let h = Math.max(-60, 60 - severity * 60);
        let s = Math.min(100, 50 + severity * 50);
        let l = Math.min(70, 30 + severity * 20);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function getEffectTitle(effect) {
        let severity = getEffectSeverity(effect);
        let color = getEffectColor(effect);
        let fontWeight = 400 + 100 * Math.floor(Math.min(4, severity * 4));

        return <span style={{ color, fontWeight }}>{effect.title}</span>;
    }

    function getEffectIcon(effect) {
        let color = getEffectColor(effect);
        let icon = effect.value > 0 ? '▲' : '▼';

        return <span style={{ color }}>{icon}</span>;
    }

    return (
        <div className={classNames(styles.diseaseOverview, 'p-3')}>
            {descriptor.description && (
                <div className='mb-3'>
                    {descriptor.description}
                </div>
            )}
            <Field
                title='Тип'
                value={sourceTitles.join(', ')}
            />
            <Field
                title='Месячная заболеваемость на миллион человек'
                value={monthlyRatePerMillionHumans}
            />
            <Field
                title='Период развития'
                value={'около ' + daysToProgress.toFixed(1) + ' дней'}
            />
            <Field
                title='Сложность лечения'
                value={getDifficultyTitle(difficulty)}
            />
            <Field
                title='Переносимость'
                value={getSeverityTitle(severity)}
            />
            <Field
                title='Impact function'
                value={getImpactFunctionTitle(descriptor.impactFunction)}
            />
            <h6 className='pt-3'>
                Симптомы:
            </h6>
            {effects.map((effect, index) => (
                <Field
                    key={index}
                    title={getEffectTitle(effect)}
                    value={getEffectIcon(effect)}
                    separator=' '
                />
            ))}
        </div>
    );
}

export default DiseaseOverview;