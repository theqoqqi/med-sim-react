import styles from './ParameterInfo.module.css';
import PropTypes from 'prop-types';
import Parameter from '../../../simulation/parameters/Parameter.js';
import React from 'react';
import classNames from 'classnames';
import {NumberParameterInfo} from './NumberParameterInfo.js';
import {EnumParameterInfo} from './EnumParameterInfo.js';
import {CompositeParameterInfo} from './CompositeParameterInfo.js';

ParameterInfo.propTypes = {
    parameter: PropTypes.instanceOf(Parameter),
    className: PropTypes.any,
    flat: PropTypes.bool,
};

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
