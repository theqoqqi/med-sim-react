import styles from './Button.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {Button as BootstrapButton, ToggleButton} from 'react-bootstrap';
import classNames from 'classnames';

Button.propTypes = {
    itemRef: PropTypes.any,
    className: PropTypes.any,
    toggle: PropTypes.bool,
    checked: PropTypes.bool,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'dark',
        'light',
        'outline-primary',
        'outline-secondary',
        'outline-success',
        'outline-danger',
        'outline-warning',
        'outline-info',
        'outline-dark',
        'outline-light',
        'transparent-primary',
        'transparent-secondary',
        'transparent-success',
        'transparent-danger',
        'transparent-warning',
        'transparent-info',
        'transparent-dark',
        'transparent-light',
        'link',
    ]),
};

function Button({ itemRef, className, variant = '', toggle = false, checked = false, ...props }) {
    let transparent = variant.startsWith('transparent-');

    if (transparent) {
        variant = variant.replace('transparent', 'outline');
    }

    className = classNames(className, styles.button, {
        [styles.transparent]: transparent,
    });

    let Component = toggle ? ToggleButton : BootstrapButton;

    return (
        <Component ref={itemRef} variant={variant} className={className} checked={checked} {...props} />
    );
}

export default Button;