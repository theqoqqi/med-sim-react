import PropTypes from 'prop-types';

Conditional.propTypes = {
    condition: PropTypes.bool,
};

function Conditional({condition, children, fallback = null}) {
    return condition ? children : fallback;
}

export default Conditional;