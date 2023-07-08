import styles from './ParameterInfo.module.css';
import PropTypes from 'prop-types';
import Parameter from '../../../simulation/parameters/Parameter.js';
import React from 'react';
import classNames from 'classnames';

ParameterInfo.propTypes = {
    parameter: PropTypes.instanceOf(Parameter),
};

function CompositeParameterInfo({parameter, flat}) {

    return (
        <div>
            {flat
                ? parameter.mapRecursive((p, pName) => <ParameterInfo key={pName} parameter={p} /> )
                : parameter.map((p, pName) => <ParameterInfo key={pName} parameter={p} /> )}
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

function ParameterInfo({parameter, flat}) {

    let mappings = {
        CompositeParameter: CompositeParameterInfo,
        NumberParameter: NumberParameterInfo,
        EnumParameter: EnumParameterInfo,
    };
    let constructorName = parameter.constructor.name;
    let typeName = constructorName.slice(0, -'Parameter'.length).toLowerCase();
    let InfoContent = mappings[constructorName];

    return (
        <div className={classNames(styles.parameterInfo, styles[typeName])}>
            {parameter.title}
            <InfoContent parameter={parameter} flat={flat} />
        </div>
    );
}

export default ParameterInfo;
