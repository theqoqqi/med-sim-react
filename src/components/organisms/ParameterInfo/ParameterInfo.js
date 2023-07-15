import styles from './ParameterInfo.module.css';
import PropTypes from 'prop-types';
import Parameter from '../../../simulation/parameters/Parameter.js';
import React from 'react';
import classNames from 'classnames';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

ParameterInfo.propTypes = {
    parameter: PropTypes.instanceOf(Parameter),
    className: PropTypes.any,
    flat: PropTypes.bool,
};

function CompositeParameterInfo({ className, parameter, human, flat }) {

    function renderParameter(p, pName) {
        return <ParameterInfo key={pName} className={className} parameter={p} human={human} />;
    }

    return <div className={styles.content}>
        <div className={styles.title}>
            {parameter.title}
        </div>
        <div className='mt-2'>
            {flat
                ? parameter.mapRecursive(renderParameter)
                : parameter.map(renderParameter)}
        </div>
    </div>;
}

function NumberParameterInfo({ parameter, human }) {

    let lethal = parameter === human.lethalParameter;
    let valueOptions = getValueOptions();

    const renderIcon = content => {
        if (!valueOptions.iconTooltip) {
            return content;
        }

        // noinspection RequiredAttributes
        return (
            <OverlayTrigger overlay={renderIconTooltip}>
                {content}
            </OverlayTrigger>
        );
    };

    const renderIconTooltip = props => (
        <Tooltip {...props}>
            {valueOptions.iconTooltip}
        </Tooltip>
    );

    function getValueOptions() {
        if (lethal) {
            return {
                style: {
                    color: '#444',
                },
                className: 'lethal',
                icon: '☠',
                iconTooltip: 'Причина смерти',
            };
        }

        if (parameter.isInNormalRange()) {
            return {
                style: {
                    color: 'darkgreen',
                },
                className: 'normal',
                icon: null,
                iconTooltip: null,
            };
        }

        let discomfortLevel = parameter.getDiscomfortLevel();
        let lethalityLevel = parameter.getLethalityLevel();

        if (lethalityLevel <= 0) {
            let h = 90 - discomfortLevel * 45;
            let s = 100 - discomfortLevel * 50;
            let l = 25 + discomfortLevel * 15;

            return {
                style: {
                    color: `hsl(${h}, ${s}%, ${l}%)`,
                },
                className: 'viable',
                icon: '❓',
                iconTooltip: 'Показатель за пределами нормы, но не опасен',
            };
        }

        let h = 30 - lethalityLevel * 30;
        let s = 100 - (lethalityLevel >= 0.5 ? (lethalityLevel - 0.5) * 200 : 0);
        let l = 25 + lethalityLevel * 25;

        return {
            style: {
                color: `hsl(${h}, ${s}%, ${l}%)`,
            },
            className: lethalityLevel < 1 ? 'danger' : 'lethal',
            icon: lethalityLevel < 1 ? '⚠' : '☠',
            iconTooltip: lethalityLevel < 1
                ? 'Опасный для жизни показатель'
                : 'Смертельно опасный показатель',
        };
    }

    return (
        <div className={classNames(styles.content, styles[valueOptions.className])} style={valueOptions.style}>
            <div className='d-flex justify-content-between'>
                <span className={styles.title}>
                    {parameter.title}
                </span>
                {renderIcon(
                    <span className={styles.icon}>
                        {valueOptions.icon}
                    </span>
                )}
            </div>
            <div>
                {parameter.value.toFixed(2)}
            </div>
        </div>
    );
}

function EnumParameterInfo({ parameter }) {

    return <div className={styles.content}>
        <div className={styles.title}>
            {parameter.title}
        </div>
        <div>
            {parameter.value}
        </div>
    </div>;
}

function ParameterInfo({ className, parameter, human, flat }) {

    let mappings = {
        CompositeParameter: CompositeParameterInfo,
        NumberParameter: NumberParameterInfo,
        EnumParameter: EnumParameterInfo,
    };
    let constructorName = parameter.constructor.name;
    let typeName = constructorName.slice(0, -'Parameter'.length).toLowerCase();
    let InfoContent = mappings[constructorName];

    return (
        <div className={classNames(styles.parameterInfo, styles[typeName], className)}>
            <InfoContent parameter={parameter} className={className} flat={flat} human={human} />
        </div>
    );
}

export default ParameterInfo;
