import './scss/ui.scss'

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

function inputMouseWheel (e) {
  e.preventDefault();

  let node = e.target;
  let round = e.shiftKey || e.ctrlKey || e.altKey;
  let step = e.shiftKey ? 10 : (e.ctrlKey ? (e.altKey ? 100 : 5) : 1);
  let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  let nodeValue = +node.value;
  let newValue = nodeValue + step * delta;

  if (newValue >= 0) {
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
    node.value = 0;
  }

}

document.getElementById('move-value').addEventListener('mousewheel', inputMouseWheel, false);

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