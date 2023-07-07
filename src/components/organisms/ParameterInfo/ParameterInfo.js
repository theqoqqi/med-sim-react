import styles from './ParameterInfo.module.css';
import PropTypes from 'prop-types';
import Parameter from '../../../simulation/parameters/Parameter.js';
import React from 'react';

ParameterInfo.propTypes = {
    parameter: PropTypes.instanceOf(Parameter),
};

function CompositeParameterInfo({parameter}) {

    return (
        <div>
            {parameter.children.map((p, index) => <ParameterInfo key={index} parameter={p} /> )}
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

function ParameterInfo({parameter}) {

    let mappings = {
        CompositeParameter: CompositeParameterInfo,
        NumberParameter: NumberParameterInfo,
        EnumParameter: EnumParameterInfo,
    };
    let InfoContent = mappings[parameter.constructor.name];

    return (
        <div className={styles.parameterInfo}>
            {parameter.title}
            <InfoContent parameter={parameter} />
        </div>
    );
}

export default ParameterInfo;
