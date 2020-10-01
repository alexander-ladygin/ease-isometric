const sectionOptions = {
  selector: {
    modal: 'section-modal',
    edit: 'section-edit',
  },
  stateClass: {
    back: 'section--back',
    modal: 'section-modal--show',
    edit: 'section-edit--show',
  }
};

function sectionEditAllClose() {
  [].forEach.call(document.querySelectorAll(`.${sectionOptions.stateClass.back}, .${sectionOptions.stateClass.modal}, .${sectionOptions.stateClass.edit}`), item => {
    item.classList.remove(sectionOptions.stateClass.back, sectionOptions.stateClass.edit, sectionOptions.stateClass.modal);
  });
}

function sectionOpen (node, userClass) {
  let section = (node instanceof Element || node instanceof HTMLDocument) ? node : document.getElementById(node);
  if (section) {
    section.classList.add(userClass || sectionOptions.stateClass.modal);

    let linkSection = document.getElementById(section.getAttribute('data-link-section'));
    if (linkSection) {
      linkSection.classList.add(sectionOptions.stateClass.back);
    }
  }
}

function sectionClose (node, userClass) {
  let section = (node instanceof Element || node instanceof HTMLDocument) ? node : document.getElementById(node);
  if (section) {
    section.classList.remove(userClass || sectionOptions.stateClass.modal);

    let linkSection = document.getElementById(section.getAttribute('data-link-section'));
    if (linkSection) {
      linkSection.classList.remove(sectionOptions.stateClass.back);
    }
  }
}

document.body.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('section-modal__btn-close')) {
    sectionClose(e.target.closest('.section') || '');
  }
});

export { sectionOpen, sectionClose, sectionOptions, sectionEditAllClose }