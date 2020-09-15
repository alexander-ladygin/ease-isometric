// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

function getCenter (node) {
  return {
    x: node.x + node.width / 2,
    y: node.y - node.height / 2
  };
}

figma.ui.onmessage = msg => { 
  const wVal = 1.2247;
  const hVal = 0.7071;

  switch (msg.type) {
    case 'top': {
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
    case 'bottom': {
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
    case 'right': {
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
        break;
      }
      break;
    }
    case 'left': {
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
        break;
      }
    }
  }
};
