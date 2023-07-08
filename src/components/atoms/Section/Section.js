import styles from './Section.module.css';
import React from 'react';
import classNames from 'classnames';
import SectionHeader from './SectionHeader';
import SectionBody from './SectionBody';

function Section({className, children}) {
    return (
        <div className={classNames(styles.section, className)}>
            {children}
        </div>
    );
}

Section.Header = SectionHeader;
Section.Body = SectionBody;

export default Section;