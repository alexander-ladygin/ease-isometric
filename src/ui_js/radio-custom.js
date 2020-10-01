let radioCustomCallbacks = {
};

function runCallbacks (node) {
  for (let prop in radioCustomCallbacks) {
    if (radioCustomCallbacks[prop] instanceof Function) {
      radioCustomCallbacks[prop](node);
    }
  }
}

function radioCustomSwitch (node) {
  [].forEach.call(node.parentNode.querySelectorAll('.radio-custom'), item => {
    item.classList.remove('radio-custom--checked');
  });
  node.classList.add('radio-custom--checked');

  return node;
}

document.body.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('radio-custom')) {
    runCallbacks(radioCustomSwitch(e.target));
  } else if (e.target.classList && e.target.closest('.radio-custom')) {
    runCallbacks(radioCustomSwitch(e.target.closest('.radio-custom')));
  }
});

export { radioCustomSwitch, radioCustomCallbacks }