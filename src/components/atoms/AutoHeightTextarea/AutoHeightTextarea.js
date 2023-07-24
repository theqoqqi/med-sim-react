import React, {useLayoutEffect, useRef} from 'react';
import PropTypes from 'prop-types';

AutoHeightTextarea.propTypes = {
    className: PropTypes.any,
    onChange: PropTypes.func,
};

function AutoHeightTextarea({className, onChange, ...otherProps}) {
    const ref = useRef(null);

    useLayoutEffect(adjustHeight, []);

    function adjustHeight() {
        if (!ref.current) {
            return;
        }

        ref.current.style.height = 'inherit';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
    }

    function handleOnChange(e) {
        onChange(e);
        adjustHeight();
    }

    return (
        <textarea
            ref={ref}
            className={className}
            onChange={handleOnChange}
            {...otherProps}
        />
    );
}

export default AutoHeightTextarea;