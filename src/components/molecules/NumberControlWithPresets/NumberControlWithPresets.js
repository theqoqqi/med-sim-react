import {Form, InputGroup} from 'react-bootstrap';
import Button from '../../atoms/Button/Button.js';
import classNames from 'classnames';
import React from 'react';

export function NumberControlWithPresets({
    className, title, unitTitle, presets,
    value, minValue, maxValue, placeholder,
    onInput
}) {

    return (
        <InputGroup className={className}>
            {title && (
                <InputGroup.Text>
                    {title}
                </InputGroup.Text>
            )}
            {presets.map(presetValue => (
                <Button
                    key={presetValue}
                    className={classNames('border', {
                        active: presetValue === +value,
                    })}
                    variant={presetValue === +value ? 'primary' : 'light'}
                    onClick={() => onInput(presetValue)}
                >
                    {presetValue}
                </Button>
            ))}
            <Form.Control
                className='text-center'
                type='number'
                value={value}
                onInput={e => onInput(e.target.value)}
                min={minValue}
                max={maxValue}
                placeholder={placeholder}
            />
            {unitTitle && (
                <InputGroup.Text>
                    {unitTitle}
                </InputGroup.Text>
            )}
        </InputGroup>
    );
}