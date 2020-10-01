import './scss/ui.scss'
import { radioCustomSwitch, radioCustomCallbacks } from './ui_js/radio-custom'
import { sectionOpen, sectionClose, sectionOptions, sectionEditAllClose } from './ui_js/sections'

// user settings
parent.postMessage({ pluginMessage: {
  type: 'loadSettings'
} }, '*');

window.onmessage = async (event) => {
  switch (event.data.pluginMessage.type) {
    case 'applyToHTMLSettings': {
      applyToHTMLSettings(event.data.pluginMessage.settings);

      break;
    }
    case 'edit-shape': {
      sectionEditAllClose();

      if (event.data.pluginMessage.sections instanceof Array && event.data.pluginMessage.sections.length) {
        sectionOpen('edit-shape');
        event.data.pluginMessage.sections.forEach((section) => {
          sectionOpen(section, sectionOptions.stateClass.edit);
        });
      }

      break;
    }
  }
};

function saveSettings() {
  parent.postMessage({ pluginMessage: {
    type: 'saveSettings',
    settings: {
      moveValue: +document.getElementById('move-value').value || 0,
      tube: {
        value: +document.getElementById('tube-value').value || 0,
        anchor: document.querySelector('.tube-anchor.radio-custom--checked').getAttribute('id') || 'tube-anchor-top',
      },
    }
  } }, '*');
}

function applyToHTMLSettings (data) {
  data.tube = data.tube || data.default.tube;
  document.getElementById('move-value').value = data.moveValue;
  document.getElementById('tube-value').value = data.tube.value;
  radioCustomSwitch(document.getElementById(data.tube.anchor));
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

// radioCustom
radioCustomCallbacks.saveSettings = function (node) {
  saveSettings();
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

function moveClickHandler (e) {
  parent.postMessage({ pluginMessage: { type: this.id, value: moveGetValue() } }, '*');
}
function moveMouseWheelHandler (e) {
  let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  let reType = this.id === 'move-top-right' ? 'move-bottom-left' : (
    this.id === 'move-top-left' ? 'move-bottom-right' : (
      this.id === 'move-bottom-left' ? 'move-top-right' : 'move-top-left'
    )
  );
  parent.postMessage({ pluginMessage: { type: delta > 0 ? this.id : reType, value: moveGetValue() } }, '*');
}

document.getElementById('move-top-right').addEventListener('click', moveClickHandler);
document.getElementById('move-top-right').addEventListener('mousewheel', moveMouseWheelHandler);

document.getElementById('move-top-left').addEventListener('click', moveClickHandler);
document.getElementById('move-top-left').addEventListener('mousewheel', moveMouseWheelHandler);

document.getElementById('move-bottom-left') .addEventListener('click', moveClickHandler);
document.getElementById('move-bottom-left').addEventListener('mousewheel', moveMouseWheelHandler);

document.getElementById('move-bottom-right').addEventListener('click', moveClickHandler);
document.getElementById('move-bottom-right').addEventListener('mousewheel', moveMouseWheelHandler);

document.getElementById('object-tube').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: { type: this.id } }, '*');
  sectionOpen('edit-shape');
});

function objectTubeGetProps (mode) {
  saveSettings();

  return {
    mode: mode,
    type: 'object-tube-change',
    anchor: document.querySelector('.tube-anchor.radio-custom--checked').getAttribute('id'),
    value: +document.getElementById('tube-value').value,
  }
}

document.getElementById('tube-value').addEventListener('change', function (e) {
  saveSettings();
});
document.getElementById('tube-value').addEventListener('keydown', inputNumberRound);
document.getElementById('tube-value').addEventListener('mousewheel', inputNumberRound);

document.getElementById('tube-change-plus').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: objectTubeGetProps('+') }, '*');
});
document.getElementById('tube-change-plus').addEventListener('mousewheel', function (e) {
  let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  parent.postMessage({ pluginMessage: objectTubeGetProps(delta < 1 ? '-' : '+') }, '*');
});
document.getElementById('tube-change-minus').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: objectTubeGetProps('-') }, '*');
});
document.getElementById('tube-change-minus').addEventListener('mousewheel', function (e) {
  let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  parent.postMessage({ pluginMessage: objectTubeGetProps(delta < 1 ? '+' : '-') }, '*');
});
document.getElementById('tube-change-equal').addEventListener('click', function (e) {
  parent.postMessage({ pluginMessage: objectTubeGetProps('=') }, '*');
});