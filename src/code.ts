import { hexToRGB } from "./helpers/color";

figma.showUI(__html__);
figma.ui.resize(200, 235);

const settingsDefault = {
  moveValue: 10
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
  pluginData: {
    key: 'ease-isometric-objects'
  },
  tube: {
    min: 30,
    w: 100,
    h: 100,
    extra: 200,
    data: `M 0 69.99999237060547 C 0 77.67766571044922 4.88153076171875 85.35533905029297 14.6446533203125 91.21318817138672 C 34.170867919921875 102.92891693115234 65.82913208007812 102.92891693115234 85.3553466796875 91.21318817138672 C 95.11846923828125 85.35533905029297 100 77.67766571044922 100 69.99999237060547 L 100 29.99999237060547 C 100 22.32231903076172 95.11846923828125 14.644660949707031 85.3553466796875 8.786796569824219 C 65.82913208007812 -2.9289321899414062 34.170867919921875 -2.9289321899414062 14.6446533203125 8.786796569824219 C 4.88153076171875 14.644660949707031 0 22.32231903076172 0 29.99999237060547 L 0 69.99999237060547 Z`,
    pos: [ 2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 50 ],
    pluginData: {
      name: 'tube-node'
    },
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

function inLayersBringTo (node, position = 'up') {
  let parent = node.parent,
    max = parent.children.length,
    idx = parent.children.indexOf(node);

  switch (position.toLowerCase()) {
    case 'up': {
      if (idx + 2 <= max) parent.insertChild(idx + 2, node);
      break;
    }
    case 'down': {
      if (idx - 1 >= 0) parent.insertChild(idx - 1, node);
      break;
    }
    case 'start': {
      parent.insertChild(max, node);
      break;
    }
    case 'end': {
      parent.insertChild(0, node);
      break;
    }
  }

  return node;
}

function inLayersInsertTo (nodes, placementNode, placementPosition) {
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
  let boolnode = figma.createBooleanOperation();

  if (nodes.length) {
    placementNode = placementNode || nodes[0];
    inLayersInsertTo([boolnode], placementNode, placementPosition);
  
    for (let node of nodes) {
      boolnode.appendChild(node);
    }
  }

  boolnode.booleanOperation = operationType;

  return boolnode;
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
        oData = objectsData.tube,
        dataArr = oData.data.split(' ');

      if (dataArr.length > 47) {
        for (let index of oData.pos) {
          dataArr[index] = '' + (+dataArr[index] + oData.extra);
        }
      }

      tube.vectorPaths = [{
        windingRule: 'EVENODD',
        data: dataArr.join(' ')
      }];

      tube.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: hexToRGB('#000')
      }];
      moveToCenterScreen(tube);

      let circleSize = 60,
        circle = figma.createEllipse();

      circle.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: hexToRGB('#fff')
      }];
      circle.resizeWithoutConstraints(circleSize, circleSize);
      circle.x = tube.x + (tubeWidth - circleSize) / 2;
      circle.y = tube.y - 1;
      isometricTop(circle);

      let boolop = figma.subtract([circle], tube.parent);
      inLayersInsertTo([boolop], tube, 'before');
      boolop.appendChild(tube);
      inLayersBringTo(circle, 'start');

      boolop.setPluginData(objectsData.pluginData.key, oData.pluginData.name);
      figma.currentPage.selection = [boolop];

      break;
    }
    case 'object-tube-change': {
      for (let node of figma.currentPage.selection) {
        if (node.getPluginData(objectsData.pluginData.key) === objectsData.tube.pluginData.name) {
          if (node.type === 'BOOLEAN_OPERATION') {
            if (node.children[0].type === 'VECTOR') {
              let vector = node.children[0],
              path = vector.vectorPaths[0],
              data = path.data,
              dataArr = data.split(' ');
        
              if (dataArr.length > 47) {
                let value = +msg.value, arr_val;

                for (let index of objectsData.tube.pos) {
                  switch (msg.mode) {
                    case '+': {
                      dataArr[index] = '' + (+dataArr[index] + value);
                      break;
                    }
                    case '-': {
                      dataArr[index] = '' + (+dataArr[index] - value);
                      break;
                    }
                    case '=': {
                      arr_val = objectsData.tube.extra + +(dataArr[index]) - +(objectsData.tube.data.split(' ')[index]) - objectsData.tube.h;
                      dataArr[index] = '' + (+dataArr[index] + (value - arr_val));
                      break;
                    }
                  }
                }

                vector.vectorPaths = [{
                  windingRule: 'EVENODD',
                  data: dataArr.join(' '),
                }];
              }
            }
          }
        }
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

figma.on('selectionchange', () => {
  if (figma.currentPage.selection.length > 30) return;

  let shapeSectionNames = [];

  for (let node of figma.currentPage.selection) {
    if (node.getPluginData(objectsData.pluginData.key) === objectsData.tube.pluginData.name) {
      if (node.type === 'BOOLEAN_OPERATION') {
        if (node.children[0].type === 'VECTOR') {
          let vector = node.children[0],
            path = vector.vectorPaths[0],
            data = path.data,
            dataArr = data.split(' ');

          if (dataArr.length > 47) {
            shapeSectionNames.push('tube');
          }
        }
      }
    }
  }

  figma.ui.postMessage({
    type: 'edit-shape',
    sections: shapeSectionNames
  });
});