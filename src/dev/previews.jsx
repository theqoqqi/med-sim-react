import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import Center from '../components/atoms/Center/Center.js';
import App from '../App.js';
import Button from '../components/atoms/Button/Button.js';

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree />}>
            <ComponentPreview path='/Center'>
                <Center style={{height: '100vh'}}>
                    Содержимое по центру
                </Center>
            </ComponentPreview>
            <ComponentPreview path='/App'>
                <App />
            </ComponentPreview>
            <ComponentPreview path='/Button'>
                <Button variant='outline-primary'>
                    Йа кнопко
                </Button>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;