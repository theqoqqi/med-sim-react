import styles from './SectionHeader.module.css';
import React from 'react';
import classNames from 'classnames';

function SectionHeader({className, children}) {
    return (
        <div className={classNames(styles.sectionHeader, className)}>
            {children}
        </div>
    );
}

export default SectionHeader;