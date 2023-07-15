import styles from './ParameterInfo.module.css';
import React from 'react';

export function EnumParameterInfo({ parameter }) {

    return <div className={styles.content}>
        <div className={styles.title}>
            {parameter.title}
        </div>
        <div>
            {parameter.value}
        </div>
    </div>;
}