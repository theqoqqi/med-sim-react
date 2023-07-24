import styles from './NumberParameterBar.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import NumberParameter from '../../../simulation/parameters/NumberParameter.js';
import classNames from 'classnames';
import NumberRange from '../../../simulation/utils/NumberRange.js';

function omitNulls(array) {
    return array.filter(nonNull);
}

function nonNull(value) {
    return value !== null && value !== undefined;
}

function toPercentString(value) {
    return value * 100 + '%';
}

NumberParameterBar.propTypes = {
    parameter: PropTypes.instanceOf(NumberParameter),
};

function ValuePointer({ value, position, offset = null }) {

    position = NumberRange.of(-0.02, 1.02).clamp(position);
    offset ??= -position + 0.5;

    return (
        <div
            className={styles.valuePointer}
            style={{
                left: toPercentString(position),
            }}
        >
            <div
                className={styles.value}
                style={{
                    transform: `translate(${toPercentString(offset)}, 0)`,
                }}
            >
                {value}
            </div>
            <div className={styles.cursor} />
        </div>
    );
}

export function NumberParameterBar({ parameter }) {

    let [hoveredClass, setHoveredClass] = useState(null);

    let value = parameter.value;

    let normalRange = parameter.normalRange;
    let viableRange = parameter.viableRange;
    let lethalRange = parameter.lethalRange;
    let validRange = parameter.validRange;

    let fullRange = lethalRange ?? viableRange ?? normalRange;
    let visibleRange = fullRange.extend(fullRange.size * 0.1);

    visibleRange = visibleRange.intersect(validRange);

    let totalSize = visibleRange.size;
    let ranges = omitNulls([
        visibleRange,
        lethalRange,
        viableRange,
        normalRange,
        viableRange,
        lethalRange,
        visibleRange,
    ]);
    let steps = omitNulls([
        visibleRange?.min,
        lethalRange?.min,
        viableRange?.min,
        normalRange?.min,
        normalRange?.max,
        viableRange?.max,
        lethalRange?.max,
        visibleRange?.max,
    ]);
    let rangeClasses = new Map([
        [normalRange, 'normal'],
        [viableRange, 'viable'],
        [lethalRange, 'danger'],
        [visibleRange, 'lethal'],
    ]);
    let rangesByClasses = new Map([
        ['normal', normalRange],
        ['viable', viableRange],
        ['danger', lethalRange],
        ['lethal', visibleRange],
    ]);

    let hoveredRange = rangesByClasses.get(hoveredClass);

    let areas = ranges.map((range, index) => {
        return {
            range,
            index,
            className: rangeClasses.get(range),
            size: steps[index + 1] - steps[index],
        };
    });

    function getValuePosition(value) {
        return (value - visibleRange.min) / visibleRange.size;
    }

    return (
        <div className={styles.numberParameterBar}>
            {!hoveredClass && (
                <ValuePointer
                    value={value.toFixed(2)}
                    position={getValuePosition(value)}
                />
            )}
            {hoveredClass && (
                <>
                    <ValuePointer
                        value={hoveredRange.min.toFixed(2)}
                        position={getValuePosition(hoveredRange.min)}
                        offset={-0.5}
                    />
                    <ValuePointer
                        value={hoveredRange.max.toFixed(2)}
                        position={getValuePosition(hoveredRange.max)}
                        offset={0.5}
                    />
                </>
            )}
            <div className={styles.barAreas}>
                {areas.map(({ index, className, size }) => (
                    <div
                        key={index}
                        className={classNames(styles.barAreaContainer, styles[className], {
                            [styles.highlighted]: hoveredClass === className,
                        })}
                        onMouseEnter={() => setHoveredClass(className)}
                        onMouseLeave={() => setHoveredClass(null)}
                        style={{
                            width: toPercentString(size / totalSize),
                        }}
                    >
                        <div
                            className={classNames(styles.barArea, styles[className], {
                                [styles.highlighted]: hoveredClass === className,
                            })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NumberParameterBar;