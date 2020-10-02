import { hexToRGB, webRGBToRGB } from "./helpers/color";

figma.showUI(__html__);
figma.ui.resize(200, 235);

const settingsDefault = {
  moveValue: 10,
  tube: {
    value: 10,
    anchor: 'tube-anchor-top',
  },
  cubic: {
    value: 10,
    anchor: 'cubic-anchor-top',
  }
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
  // default
  pluginData: {
    key: 'ease-isometric-objects'
  },
  appendToFrame: false,
  
  //objects
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
  },

  cubic: {
    names: {
      group: 'isometric-cubic',
      prefixSides: 'side-'
    },
    pluginData: {
      name: 'cubic-node',
      side: 'cubic-side'
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

function isometricMoveTopLeft (nodes, value) {
  let angle = 60;
  let val = (value * (value < 0 ? -1 : 1)) * -1;
  
  for (const node of nodes) {
    node.x += val * Math.sin( mathRadians(angle % 360) );
    node.y += val * Math.cos( mathRadians(angle % 360) );
  }
}

function isometricMoveTopRight (nodes, value) {
  let angle = 60;
  let val = (value * (value < 0 ? -1 : 1));
  
  for (const node of nodes) {
    node.x += val * Math.sin( mathRadians(angle % 360) );
    node.y -= val * Math.cos( mathRadians(angle % 360) );
  }
}

function isometricMoveBottomRight (nodes, value) {
  let angle = 60;
  let val = (value * (value < 0 ? -1 : 1));
  
  for (const node of nodes) {
    node.x += val * Math.sin( mathRadians(angle % 360) );
    node.y += val * Math.cos( mathRadians(angle % 360) );
  }
}

function isometricMoveBottomLeft (nodes, value) {
  let angle = 60;
  let val = (value * (value < 0 ? -1 : 1)) * -1;
  
  for (const node of nodes) {
    node.x += val * Math.sin( mathRadians(angle % 360) );
    node.y -= val * Math.cos( mathRadians(angle % 360) );
  }
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

function toGroup (nodes, options = {}) {
  if (nodes && nodes.length) {
    let group = figma.group(nodes, nodes[0].parent);
    
    for (let prop in options) {
      group[prop] = options[prop];
    }

    for (let node of nodes) {
      inLayersBringTo(node, 'end');
    }

    return group;
  }

  return null;
}

function ungroup (group) {
  let parent = group.parent,
    idx = parent.children.indexOf(group),
    childs = group.children,
    i = childs.length,
    arr = [];

  if (i) while (i--) {
    parent.insertChild(idx, childs[i]);
    arr.push(childs[i]);
  }

  return arr;
}

function moveToCenterScreen (node) {
  node.x = figma.viewport.center.x - node.width / 2;
  node.y = figma.viewport.center.y - node.height / 2;

  return node;
}

function getFrameParent (node) {
  return (node.type === 'FRAME' || node.type === 'PAGE') ? node : getFrameParent(node.parent);
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
    // transform
    case 'isometric-top': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      for (const node of figma.currentPage.selection) {
        isometricTop(node);
      }
      break;
    }
    case 'isometric-bottom': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      for (const node of figma.currentPage.selection) {
        isometricBottom(node);
      }
      break;
    }
    case 'isometric-right': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      for (const node of figma.currentPage.selection) {
        isometricRight(node);
      }
      break;
    }
    case 'isometric-left': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      for (const node of figma.currentPage.selection) {
        isometricLeft(node);
      }
      break;
    }

    // move
    case 'move-top-left': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      isometricMoveTopLeft(figma.currentPage.selection, +msg.value);
      break;
    }
    case 'move-top-right': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      isometricMoveTopRight(figma.currentPage.selection, +msg.value);
      break;
    }
    case 'move-bottom-right': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      isometricMoveBottomRight(figma.currentPage.selection, +msg.value);
      break;
    }
    case 'move-bottom-left': {
      if (!figma.currentPage.selection.length) {
        return figma.notify('Please select one or more objects!');
      }

      isometricMoveBottomLeft(figma.currentPage.selection, +msg.value);
      break;
    }

    // tube object
    case 'object-tube': {
      let frameInSelection;
      if (objectsData.appendToFrame && figma.currentPage.selection) {
        frameInSelection = getFrameParent(figma.currentPage.selection[0]);
      }

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

      tube.strokes = [];
      tube.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: hexToRGB('#000')
      }];

      moveToCenterScreen(tube);

      let circleSize = 76,
        circleInnerSize = 0.7,
        circle = figma.createEllipse();

      circle.strokes = [];
      circle.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: hexToRGB('#fff')
      }];
      circle.resizeWithoutConstraints(circleSize * circleInnerSize, circleSize * circleInnerSize);
      circle.x = tube.x + (tubeWidth - circleSize * circleInnerSize) / 2;
      circle.y = tube.y + 3;
      isometricTop(circle);

      let ring = figma.createEllipse();

      ring.fills = [];
      ring.strokes = [{
        type: 'SOLID',
        opacity: 1,
        color: hexToRGB('#fff')
      }];
      ring.strokeAlign = 'INSIDE';
      ring.strokeWeight = 2;
      ring.resizeWithoutConstraints(circleSize, circleSize);
      ring.x = tube.x + (tubeWidth - circleSize) / 2;
      ring.y = tube.y - 9;
      isometricTop(ring);

      let boolGroup = figma[msg.method]([ring, circle], tube.parent);
      inLayersInsertTo([boolGroup], tube, 'before');
      boolGroup.appendChild(tube);
      inLayersBringTo(tube, 'end');
      if (msg.method === 'substract') boolGroup.fills = [{
        type: 'SOLID',
        opacity: 1,
        color: hexToRGB('#000')
      }];

      if (objectsData.appendToFrame && frameInSelection && frameInSelection.type === 'FRAME') {
        frameInSelection.appendChild(boolGroup);
        inLayersBringTo(boolGroup, 'start');
        boolGroup.x = frameInSelection.width / 2 - boolGroup.width / 2;
        boolGroup.y = frameInSelection.height / 2 - boolGroup.height / 2;
      }

      boolGroup.setPluginData(objectsData.pluginData.key, oData.pluginData.name);
      figma.currentPage.selection = [boolGroup];

      break;
    }
    case 'object-tube-change': {
      for (let node of figma.currentPage.selection) {
        if (node.getPluginData(objectsData.pluginData.key) === objectsData.tube.pluginData.name) {
          if ((node.type === 'BOOLEAN_OPERATION') || (node.type === 'GROUP')) {
            if (node.children[0].type === 'VECTOR') {
              let nodeHeight = node.height,
                vector = node.children[0],
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

                switch (msg.anchor.replace('tube-anchor-', '')) {
                  case 'center': {
                    if (msg.mode === '=') {
                      node.y -= (node.height - nodeHeight) / 2;
                    } else {
                      node.y += (value / (msg.mode === '-' ? 2 : -2));
                    }
                    break;
                  }
                  case 'bottom': {
                    if (msg.mode === '=') {
                      node.y -= (node.height - nodeHeight);
                    } else {
                      msg.mode === '-' ? node.y += value : node.y -= value;
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      }

      break;
    }

    // cubic object
    case 'object-cubic': {
      let oData = objectsData.cubic,
        size = 50,
        sides = {
          backright: figma.createRectangle(),
          backleft: figma.createRectangle(),
          top: figma.createRectangle(),
          right: figma.createRectangle(),
          bottom: figma.createRectangle(),
          left: figma.createRectangle(),
        };

      let colorValue = 70,
        step = 20,
        counter = 1;

      for (let prop in sides) {
        sides[prop].name = objectsData.cubic.names.prefixSides + prop;
        sides[prop].resizeWithoutConstraints(size, size);
        sides[prop].fills = [{
          type: 'SOLID',
          opacity: 1,
          color: webRGBToRGB([colorValue + step * counter, colorValue + step * counter, colorValue + step * counter])
        }];
        sides[prop].setPluginData(oData.pluginData.side, prop);
        counter++;
        moveToCenterScreen(sides[prop]);
      }

      isometricTop(sides.top);
      isometricRight(sides.right);
      isometricBottom(sides.bottom);
      isometricLeft(sides.left);
      isometricLeft(sides.backleft);
      isometricRight(sides.backright);


      // align side left
      let sideLeftGroup = toGroup([sides.left]),
        sidesLeftWidth = sideLeftGroup.width,
        sidesLeftHeight = sideLeftGroup.height;

      sideLeftGroup.x -= sideLeftGroup.width;

      let sideLeftGroupProps = {
          x: sideLeftGroup.x,
          y: sideLeftGroup.y,
          w: sideLeftGroup.width,
          h: sideLeftGroup.height,
        };
      ungroup(sideLeftGroup);


      // align side bottom
      let sideBottomGroup = toGroup([sides.bottom]);

      sideBottomGroup.x = sides.left.x + sidesLeftWidth - sideBottomGroup.width / 2;
      sideBottomGroup.y = sides.left.y + sidesLeftHeight - sideBottomGroup.height;

      let sidesBottomProps = {
          x: sideBottomGroup.x,
          y: sideBottomGroup.y,
          w: sideBottomGroup.width,
          h: sideBottomGroup.height,
        };
      ungroup(sideBottomGroup);

      // align side top
      let sideTopGroup = toGroup([sides.top]);

      sideTopGroup.x = sidesBottomProps.x;
      sideTopGroup.y = sidesBottomProps.y - sideTopGroup.height;

      let sideTopGroupProps = {
        x: sideTopGroup.x,
        y: sideTopGroup.y,
        w: sideTopGroup.width,
        h: sideTopGroup.height,
      };
      ungroup(sideTopGroup);

      // align side back right
      let sideBackRightGroup = toGroup([sides.backright]);

      sideBackRightGroup.x = sideLeftGroupProps.x;
      sideBackRightGroup.y = sideTopGroupProps.y;
      ungroup(sideBackRightGroup);

      // align side back left
      let sideBackLeftGroup = toGroup([sides.backleft]);

      sideBackLeftGroup.y = sideTopGroupProps.y;
      ungroup(sideBackLeftGroup);

      // group sides
      let cubicGroup = toGroup([sides.top, sides.right, sides.left, sides.bottom, sides.backright, sides.backleft], {
        name: objectsData.cubic.names.group
      });

      // inLayersBringTo(sides.bottom, 'end');
      cubicGroup.setPluginData(objectsData.pluginData.key, oData.pluginData.name);
      figma.currentPage.selection = [cubicGroup];

      break;
    }
    case 'object-cubic-change': {
      let oData = objectsData.cubic,
        value = +msg.value * (msg.mode === '-' ? -1 : 1);

      for (let node of figma.currentPage.selection) {
        if (node.getPluginData(objectsData.pluginData.key) === objectsData.cubic.pluginData.name) {
          switch (msg.direction) {
            case 'left': {
              if (node.type === 'GROUP') {
                for (let side of node.children) {
                  switch (side.getPluginData(oData.pluginData.side)) {
                    case 'left': {
                      side.resizeWithoutConstraints(side.width + value, side.height);
                      if (msg.mode === '-') isometricMoveBottomRight([side], value);
                        else isometricMoveTopLeft([side], value);
                      break;
                    }
                    case 'top': {
                      side.resizeWithoutConstraints(side.width, side.height + value);
                      if (msg.mode === '-') isometricMoveBottomRight([side], value);
                        else isometricMoveTopLeft([side], value);
                      break;
                    }
                    case 'bottom': {
                      side.resizeWithoutConstraints(side.width + value, side.height);
                      if (msg.mode === '-') isometricMoveBottomRight([side], value);
                        else isometricMoveTopLeft([side], value);
                      break;
                    }
                    case 'backleft': {
                      side.resizeWithoutConstraints(side.width + value, side.height);
                      if (msg.mode === '-') isometricMoveBottomRight([side], value);
                        else isometricMoveTopLeft([side], value);
                      break;
                    }
                    case 'backright': {
                      if (msg.mode === '-') isometricMoveBottomRight([side], value);
                        else isometricMoveTopLeft([side], value);
                      break;
                    }
                  }
                }

                // align anchor
                switch (msg.anchor.replace('cubic-anchor-', '')) {
                  case 'bottom': {
                    if (msg.mode === '-') isometricMoveTopLeft([node], value);
                      else isometricMoveBottomRight([node], value);
                    break;
                  }
                  case 'center': {
                    if (msg.mode === '-') isometricMoveTopLeft([node], value / 2);
                      else isometricMoveBottomRight([node], value / 2);
                    break;
                  }
                }
              }

              break;
            }
            case 'right': {
              if (node.type === 'GROUP') {
                for (let side of node.children) {
                  switch (side.getPluginData(oData.pluginData.side)) {
                    case 'right': {
                      side.resizeWithoutConstraints(side.width + value, side.height);
                      break;
                    }
                    case 'top': {
                      side.resizeWithoutConstraints(side.width + value, side.height);
                      break;
                    }
                    case 'bottom': {
                      side.resizeWithoutConstraints(side.width, side.height + value);
                      if (msg.mode === '-') isometricMoveBottomLeft([side], value);
                        else isometricMoveTopRight([side], value);
                      break;
                    }
                    case 'backleft': {
                      if (msg.mode === '-') isometricMoveBottomLeft([side], value);
                        else isometricMoveTopRight([side], value);
                      break;
                    }
                    case 'backright': {
                      side.resizeWithoutConstraints(side.width + value, side.height);
                      break;
                    }
                  }
                }
              }

              // align anchor
              switch (msg.anchor.replace('cubic-anchor-', '')) {
                case 'bottom': {
                  if (msg.mode === '-') isometricMoveTopRight([node], value);
                    else isometricMoveBottomLeft([node], value);
                  break;
                }
                case 'center': {
                  if (msg.mode === '-') isometricMoveTopRight([node], value / 2);
                    else isometricMoveBottomLeft([node], value / 2);
                  break;
                }
              }

              break;
            }
            case 'bottom': {
              if (node.type === 'GROUP') {
                for (let side of node.children) {
                  switch (side.getPluginData(oData.pluginData.side)) {
                    case 'right': {
                      side.resizeWithoutConstraints(side.width, side.height + value);
                      break;
                    }
                    case 'bottom': {
                      side.y += value;
                      break;
                    }
                    case 'left': {
                      side.resizeWithoutConstraints(side.width, side.height + value);
                      break;
                    }
                    case 'backleft': {
                      side.resizeWithoutConstraints(side.width, side.height + value);
                      break;
                    }
                    case 'backright': {
                      side.resizeWithoutConstraints(side.width, side.height + value);
                      break;
                    }
                  }
                }
              }

              // align anchor
              switch (msg.anchor.replace('cubic-anchor-', '')) {
                case 'top': {
                  node.y -= value;
                  break;
                }
                case 'center': {
                  node.y -= value / 2;
                  break;
                }
              }

              break;
            }
          }
        }
      }

      break;
    }

    // settings
    case 'loadSettings': {
      openSectionsEdit();

      let settings = loadSettings()
        .then(settings => {
          settings.default = settingsDefault;
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

function openSectionsEdit() {
  if (figma.currentPage.selection.length > 30) return;

  let shapeSectionNames = [];

  for (let node of figma.currentPage.selection) {
    switch (node.getPluginData(objectsData.pluginData.key)) {
      // tube
      case objectsData.tube.pluginData.name: {
        if ((node.type === 'BOOLEAN_OPERATION') || (node.type === 'GROUP')) {
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

        break;
      }

      // cubic
      case objectsData.cubic.pluginData.name: {
        shapeSectionNames.push('cubic');
        break;
      }
    }
  }

  figma.ui.postMessage({
    type: 'edit-shape',
    sections: shapeSectionNames
  });
}

figma.on('selectionchange', () => {
  openSectionsEdit();
});