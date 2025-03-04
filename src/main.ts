import './styles/global.css';
import App from './App.svelte';
import { applyColorsToCSS } from './config/cubeColors';

applyColorsToCSS();

const app = new App({
  target: document.getElementById('app') || document.body
});

export default app; 