import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';

BusyModal.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
};

function BusyModal({ show, title = 'Выполнение...', message = 'Пожалуйста, подождите...' }) {
    return (
        <Modal show={show} backdrop='static'>
            <Modal.Header>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
        </Modal>
    );
}

export default BusyModal;