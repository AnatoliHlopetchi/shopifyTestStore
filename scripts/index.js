import '../styles/main.css';
import './lib/hmr';
import { component } from 'picoapp';

import './async';
import app from './app';

window.app = app;
window.component = component;
window.vendors = name => app.emit(`${name}:loaded`);

app.on('mount', () => console.log('js is mounted'));
