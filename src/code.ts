figma.showUI(__html__);
figma.ui.resize(190, 160);

const settingsDefault = {
  moveValue: 10
};

const wVal = 1.22465;
const hVal = 0.7070;

function mathRadians (d) {
  return d * (Math.PI / 180);
}

function getCenter (node) {
  return {
    x: node.x + node.width / 2,
    y: node.y - node.height / 2
  };
}

function reflectX (node) {
  node.relativeTransform = [
    [node.relativeTransform[0][0] * -1, node.relativeTransform[0][1], node.relativeTransform[0][2]],
    [node.relativeTransform[1][0], node.relativeTransform[1][1], node.relativeTransform[1][2]]
  ];

  return node;
}

function reflectY (node) {
  node.relativeTransform = [
    [node.relativeTransform[0][0], node.relativeTransform[0][1], node.relativeTransform[0][2]],
    [node.relativeTransform[1][0], node.relativeTransform[1][1] * -1, node.relativeTransform[1][2] + node.height]
  ];
}

async function loadSettings() {
  let userOptions = await figma.clientStorage.getAsync('settings');

  if (userOptions) {
    return JSON.parse(userOptions);
  } else {
    await figma.clientStorage.setAsync('settings', JSON.stringify(settingsDefault));
    return settingsDefault;
  }
}

async function saveSettings (data) {
  await figma.clientStorage.setAsync('settings', JSON.stringify(data));
  return 'saved';
}

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'isometric-top': {
      for (const node of figma.currentPage.selection) {
        let parent = node.parent;
        let idx = parent.children.indexOf(node);
        let center = getCenter(node);

        node.rotation = 45;

        let group = figma.group([node], parent);
        group.resize(group.width * wVal, group.height * hVal);
        group.x = center.x - group.width / 2;
        group.y = center.y + group.height / 2;

        group.parent.insertChild(idx, node);
      }
      break;
    }
    case 'isometric-bottom': {
      for (const node of figma.currentPage.selection) {

        let parent = node.parent;
        let idx = parent.children.indexOf(node);
        let center = getCenter(node);

        node.rotation = -45;

        let group = figma.group([node], parent);
        group.resize(group.width * wVal, group.height * hVal);
        group.x = center.x - group.width / 2;
        group.y = center.y + group.height / 2;

        group.parent.insertChild(idx, node);
      }
      break;
    }
    case 'isometric-right': {
      for (const node of figma.currentPage.selection) {
        let parent = node.parent;
        let idx = parent.children.indexOf(node);
        let center = getCenter(node);

        node.rotation = 135;

        let group = figma.group([node], parent);
        group.resize(group.width * wVal, group.height * hVal);
        group.rotation = -120;

        let g2 = figma.group([group], parent);
        g2.x = center.x - g2.width / 2;
        g2.y = center.y;
        group.parent.parent.insertChild(idx, node);
      }
      break;
    }
    case 'isometric-left': {
      for (const node of figma.currentPage.selection) {
        let parent = node.parent;
        let idx = parent.children.indexOf(node);
        let center = getCenter(node);

        node.rotation = 45;

        let group = figma.group([node], parent);
        group.resize(group.width * wVal, group.height * hVal);
        group.rotation = -60;

        group.x = center.x;
        group.y = center.y;
        group.parent.insertChild(idx, node);
      }
      break;
    }
    case 'move-top-left': {
      let angle = 60;
      let val = +msg.value * -1;

      for (const node of figma.currentPage.selection) {
        node.x += val * Math.sin( mathRadians(angle % 360) );
        node.y += val * Math.cos( mathRadians(angle % 360) );
      }
      break;
    }
    case 'move-top-right': {
      let angle = 60;
      let val = +msg.value;

      for (const node of figma.currentPage.selection) {
        node.x += val * Math.sin( mathRadians(angle % 360) );
        node.y -= val * Math.cos( mathRadians(angle % 360) );
      }
      break;
    }
    case 'move-bottom-right': {
      let angle = 60;
      let val = +msg.value;

      for (const node of figma.currentPage.selection) {
        node.x += val * Math.sin( mathRadians(angle % 360) );
        node.y += val * Math.cos( mathRadians(angle % 360) );
      }
      break;
    }
    case 'move-bottom-left': {
      let angle = 60;
      let val = +msg.value * -1;

      for (const node of figma.currentPage.selection) {
        node.x += val * Math.sin( mathRadians(angle % 360) );
        node.y -= val * Math.cos( mathRadians(angle % 360) );
      }
      break;
    }
    case 'loadSettings': {
      let settings = loadSettings()
        .then(settings => {
          figma.ui.postMessage({
            type: 'applyToHTMLSettings',
            settings: settings
          });
        });

      break;
    }
    case 'saveSettings': {
      saveSettings(msg.settings)
        .then((message) => {
          figma.ui.postMessage({
            type: 'settingsSaved',
            message: 'Settings saved! ;)'
          });
        });

      break;
    }
  }
};
