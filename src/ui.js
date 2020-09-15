import './ui.scss'

document.getElementById('top').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'top' } }, '*')
}

document.getElementById('bottom').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'bottom' } }, '*')
}

document.getElementById('right').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'right' } }, '*')
}

document.getElementById('left').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'left' } }, '*')
}

document.getElementById('step_x').addEventListener('change', function (e) {
  parent.postMessage({ pluginMessage: { type: 'step_x', value: this.value } }, '*')
  this.value = 0;
});

document.getElementById('step_y').addEventListener('change', function (e) {
  // this.value = 0;
});

document.getElementById('step_x_value').addEventListener('mousewheel', function (e) {});

document.getElementById('step_x_value').value = document.getElementById('step_x').value;
document.getElementById('step_y_value').value = document.getElementById('step_y').value;