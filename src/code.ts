figma.showUI(__html__);
figma.ui.resize(190, 225);

const settingsDefault = {
  moveValue: 10
};

const pluginData = {
  objects: 'ease-isometric-objects'
};

const wVal = 1.22465;
const hVal = 0.7070;
const defaultColor = {
  type: 'SOLID',
  opacity: 1,
  color: {
    r: 0,
    g: 0,
    b: 0
  }
};
const objectsData = {
  tube: {
    min: 30,
    extra: -40,
    data: `M 101 32.5615 C 101 24.1211 97.5142 15.7759 86.5129 9.45271 C 66.9045 -1.81757 35.1128 -1.81757 15.5044 9.45271 C 4.55085 15.7484 1.00004 24.6211 1.00004 32.4538 L 1 69.4921 C 1 78.1211 4.51823 86.2378 15.4957 92.5473 C 35.1043 103.818 66.8958 103.818 86.5044 92.5473 C 97.482 86.2377 101 78.1211 101 69.4915 Z`,
    pos: [
      26,
      29,
      31,
      33,
      36,
      38,
      40,
      43,
      45,
      47
    ]
  }
};

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

function isometricTop (node) {
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

function isometricBottom (node) {
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

function isometricRight (node) {
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

function isometricLeft (node) {
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

function insertTo (nodes, placementNode, placementPosition) {
  placementPosition = (placementPosition || 'before').toLowerCase();

  let parent = placementNode.parent,
    items = parent.children,
    idx = items.indexOf(placementNode);

  for (let node of nodes) {
    switch (placementPosition) {
      case 'before': {
        parent.insertChild(idx, node);
        break;
      }
      case 'after': {
        parent.insertChild(idx + 1, node);
        break;
      }
      case 'start': {
        parent.insertChild(0, node);
        break;
      }
      case 'end': {
        parent.insertChild(items.length, node);
        break;
      }
    }
  }
}

function toBool (nodes, operationType, placementNode = null, placementPosition = 'before') {
  if (!nodes.length) return;

  console.log(typeof operationType);

  const boolop = figma.createBooleanOperation();
  boolop.booleanOperation = operationType;
  placementNode = placementNode || nodes[0];
  insertTo([boolop], placementNode, placementPosition);
  let idx = placementNode.parent.children.indexOf(placementNode);

  for (const node of nodes) {
    boolop.appendChild(node);
  }

  return boolop;
}

function moveToCenterScreen (node) {
  node.x = figma.viewport.center.x - node.width / 2;
  node.y = figma.viewport.center.y - node.height / 2;

  return node;
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
        isometricTop(node);
      }
      break;
    }
    case 'isometric-bottom': {
      for (const node of figma.currentPage.selection) {
        isometricBottom(node);
      }
      break;
    }
    case 'isometric-right': {
      for (const node of figma.currentPage.selection) {
        isometricRight(node);
      }
      break;
    }
    case 'isometric-left': {
      for (const node of figma.currentPage.selection) {
        isometricLeft(node);
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
    case 'object-tube': {
      let tube = figma.createVector(),
        tubeWidth = 100,
        dataArr = objectsData.tube.data.split(' ');

      if (dataArr.length > 47) {
        for (let index of objectsData.tube.pos) {
          dataArr[index] = '' + (+dataArr[index] + objectsData.tube.extra);
        }
      }

      tube.vectorPaths = [{
        windingRule: 'NONZERO',
        data: dataArr.join(' '),
      }];

      tube.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: {
          r: 0,
          g: 0,
          b: 0
        }
      }];
      moveToCenterScreen(tube);

      let circleSize = 60,
        circle = figma.createEllipse();

      circle.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: {
          r: 0,
          g: 0,
          b: 0
        }
      }];
      circle.resizeWithoutConstraints(circleSize, circleSize);
      circle.x = tube.x + (tubeWidth - circleSize) / 2;
      circle.y = tube.y - 1;
      isometricTop(circle);

      let boolop = toBool([tube, circle], 'SUBTRACT');
      if (boolop) boolop.setPluginData(pluginData.objects, 'tube');
    }
    case 'object-tube-change': {

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

figma.on('selectionchange', () => {
  for (let node of figma.currentPage.selection) {
    if (node.getPluginData(pluginData.objects) === 'tube') {
      if (node.type === 'BOOLEAN_OPERATION') {
        if (node.children[0].type === 'VECTOR') {          
          let vector = node.children[0],
            path = vector.vectorPaths[0],
            data = path.data,
            dataArr = data.split(' ');

          if (dataArr.length > 47) {
            for (let index of objectsData.tube.pos) {
              dataArr[index] = '' + (+dataArr[index] + 100);
            }

            // vector.vectorPaths = [{
            //   windingRule: 'NONZERO',
            //   data: dataArr.join(' '),
            // }];
          }
        }
      }
    }
  }
});