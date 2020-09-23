import './scss/ui.scss'

// user settings
parent.postMessage({ pluginMessage: {
  type: 'loadSettings'
} }, '*');

window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'applyToHTMLSettings') {
    applyToHTMLSettings(event.data.pluginMessage.settings);
  }
};

function saveSettings() {
  parent.postMessage({ pluginMessage: {
    type: 'saveSettings',
    settings: {
      moveValue: +document.getElementById('move-value').value
    }
  } }, '*');
}

function applyToHTMLSettings (data) {
  document.getElementById('move-value').value = data.moveValue;
}

function inputNumberRound (e) {
  let delta = ( e.keyCode === 38 ? 1 : (e.keyCode === 40 ? -1 : Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))) );
  if (delta === 0) return;

  e.preventDefault();

  let node = e.target;
  let round = e.shiftKey || e.ctrlKey || e.altKey;
  let step = e.shiftKey ? 10 : (e.ctrlKey ? (e.altKey ? 100 : 5) : 1);
  let nodeValue = +node.value;
  let min = +node.getAttribute('min') || 0;
  let max = +node.getAttribute('max') || 100000 * 100000;
  let newValue = nodeValue + step * delta;

  if (newValue >= min && newValue <= max) {
    if (round && delta < 0) {
      if (newValue % step === 0) {
        node.value = newValue;
      } else {
        node.value = Math.ceil(nodeValue / 10) * 10 - step;
      }
    } else if (round && delta > 0) {
      if (newValue % step === 0) {
        node.value = newValue;
      } else {
        node.value = Math.floor(nodeValue / 10) * 10 + step;
      }
    } else {
      node.value = newValue;
    }
  } else {
    node.value = newValue < min ? min : max;
  }

  let eventChange = new Event('change');
  node.dispatchEvent(eventChange);
}

// isometric
document.getElementById('isometric-top').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: { type: this.id } }, '*');
});

document.getElementById('isometric-bottom').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: { type: this.id } }, '*');
});

document.getElementById('isometric-right').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: { type: this.id } }, '*');
});

document.getElementById('isometric-left').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: { type: this.id } }, '*');
});

// move
function moveGetValue() {
  return +document.getElementById('move-value').value;
}

document.getElementById('move-value').addEventListener('change', function (e) {
  saveSettings();
});
document.getElementById('move-value').addEventListener('keydown', inputNumberRound);
document.getElementById('move-value').addEventListener('mousewheel', inputNumberRound);

document.getElementById('move-top-right').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'move-top-right', value: moveGetValue() } }, '*')
}

document.getElementById('move-top-left').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'move-top-left', value: moveGetValue() } }, '*')
}

document.getElementById('move-bottom-left').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'move-bottom-left', value: moveGetValue() } }, '*')
}

document.getElementById('move-bottom-right').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'move-bottom-right', value: moveGetValue() } }, '*')
}