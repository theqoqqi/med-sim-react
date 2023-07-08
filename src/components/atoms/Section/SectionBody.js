import styles from './SectionBody.module.css';
import React from 'react';
import classNames from 'classnames';
import ScrollPane from '../ScrollPane/ScrollPane';

function SectionBody({className, scrollable, children}) {
    if (scrollable) {
        return (
            <ScrollPane
                className={classNames(styles.sectionBody, className)}
                orientation='vertical'
            >
                {children}
            </ScrollPane>
        );
    }

    return (
        <div className={classNames(styles.sectionBody, className)}>
            {children}
        </div>
    );
}

export default SectionBody;