export const cubeColors = {
  white: '#ffffff',
  yellow: '#ffdd00',
  orange: '#ff8000',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#4800ff',
  border: '#222222',
  black: '#333333'
};

export function applyColorsToCSS() {
  Object.entries(cubeColors).forEach(([name, color]) => {
    document.documentElement.style.setProperty(`--color-${name}`, color);
  });
} 