import styles from './ScrollPane.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ScrollPane = ({children, orientation, className, contentRef, style = {}, ...props}) => {
    style = {
        ...style,
        overflowX: ['both', 'horizontal'].includes(orientation) ? 'auto' : 'hidden',
        overflowY: ['both', 'vertical'].includes(orientation) ? 'auto' : 'hidden',
    };

    return (
        <div
            ref={contentRef}
            className={classNames(styles.scrollPane, className)}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};

ScrollPane.propTypes = {
    orientation: PropTypes.oneOf([
        'vertical',
        'horizontal',
        'both',
    ]),
};

export default ScrollPane;