import styles from './ParameterInfo.module.css';
import React from 'react';
import ParameterInfo from './ParameterInfo.js';

export function CompositeParameterInfo({ className, parameter, human, flat }) {

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