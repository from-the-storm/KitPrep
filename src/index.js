import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import './index.css';
import Preparator from './components/Preparator';

ReactDOM.render(
    <BrowserRouter>
        <Preparator />
    </BrowserRouter>,
    document.getElementById('kit-prep')
)