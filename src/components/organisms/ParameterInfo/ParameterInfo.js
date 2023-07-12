import styles from './ParameterInfo.module.css';
import PropTypes from 'prop-types';
import Parameter from '../../../simulation/parameters/Parameter.js';
import React from 'react';
import classNames from 'classnames';

ParameterInfo.propTypes = {
    parameter: PropTypes.instanceOf(Parameter),
    className: PropTypes.any,
    flat: PropTypes.bool,
};

function CompositeParameterInfo({className, parameter, flat}) {

    function renderParameter(p, pName) {
        return <ParameterInfo key={pName} className={className} parameter={p} />;
    }

    return (
        <div className='mt-2'>
            {flat
                ? parameter.mapRecursive(renderParameter)
                : parameter.map(renderParameter)}
        </div>
    );
}

function NumberParameterInfo({parameter}) {

    return (
        <div>
            {parameter.value.toFixed(2)}
        </div>
    );
}

function EnumParameterInfo({parameter}) {

    return (
        <div>
            {parameter.value}
        </div>
    );
}

function ParameterInfo({className, parameter, flat}) {

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
            {parameter.title}
            <InfoContent parameter={parameter} className={className} flat={flat} />
        </div>
    );
}

export default ParameterInfo;
