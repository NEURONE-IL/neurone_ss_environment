import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  pageCount: number,
  visiblePaperX: number,
  visiblePaperY: number
}

export function addPageNode(jointInputParams: jointInputParameters): number {
  
  jointInputParams.paper.hideTools();
  let diagram = jointInputParams.graph.toJSON();

  let positionX = jointInputParams.visiblePaperX + 100;
  let positionY = jointInputParams.visiblePaperY + 30;

  let positionValid = false;
  while (!positionValid) {
    positionValid = true;
    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type !== "link") {
        let nodePositionX = diagram.cells[i].position.x;
        let nodePositionY = diagram.cells[i].position.y;
        if ((nodePositionX == positionX) && (nodePositionY == positionY)) {
          positionValid = false;
          positionX = positionX + 20;
          positionY = positionY + 20;
        }
      }
    }
  }

  let pageCount = jointInputParams.pageCount;
  pageCount = pageCount + 1;

  let text = '(new page '.concat(pageCount.toString()).concat(')');

  let textValid = false;
  while (!textValid) {
    textValid = true;
    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type !== "link") {
        if (diagram.cells[i].attrs.label.text === text) {
          textValid = false;
          pageCount = pageCount + 1;
          text = '(new page '.concat(pageCount.toString()).concat(')');
        }
      }
    }
  }

  var pageNode = new joint.shapes.standard.BorderedImage({
    position: {
      x: positionX,
      y: positionY
    },
    size: {
      width: 150,
      height: 65
    },
    attrs: {
      root: {
        magnet: false
      },
      background: {
        fill: 'lightgrey'
      },
      border: {
        stroke: 'black',
        rx: 5,
        ry: 5,
      },
      label: {
        text: text
      },
      image: {
        "xlink:href": "/assets/behavior-model-page.png",
        refWidth: 0.7,
        refHeight: 0.7,
        refX: 0.15,
        refY: 0.15
      }
    },
    ports: {
      groups: {
        'leftPorts': {
          position: 'left',
          label: {
            position: 'outside'
          },
          attrs: {
            portBody: {
              r: 8,
              fill: 'green',
              stroke: 'black',
              magnet: true
            }
          },
          markup: [{
            tagName: 'circle',
            selector: 'portBody'
          }]
        },
        'rightPorts': {
          position: 'right',
          label: {
            position: 'outside'
          },
          attrs: {
            portBody: {
              r: 8,
              fill: 'green',
              stroke: 'black',
              magnet: true
            }
          },
          markup: [{
            tagName: 'circle',
            selector: 'portBody'
          }]
        },
      }
    }
  });

  pageNode.addPorts([
      { 
          group: 'leftPorts',
          attrs: { label: { text: 'leftPort1' }}
      },
      { 
          group: 'leftPorts',
          attrs: { label: { text: 'leftPort2' }}
      },
      { 
          group: 'rightPorts',
          attrs: { label: { text: 'rightPort1' }}
      },
      { 
          group: 'rightPorts',
          attrs: { label: { text: 'rightPort2' }}
      },
  ]);

  pageNode.prop('typeNode', 'page');
  pageNode.prop('minTransitionTime', -1);
  pageNode.prop('maxTransitionTime', -1);
  pageNode.prop('relevantPage', false);

  pageNode.addTo(jointInputParams.graph);

  var elementView = pageNode.findView(jointInputParams.paper);

  var boundaryTool = new joint.elementTools.Boundary();
  var removeButton = new joint.elementTools.Remove({

  });

  var toolsView = new joint.dia.ToolsView({
      tools: [
          boundaryTool,
          removeButton
      ]
  });

  elementView.addTools(toolsView);
  elementView.hideTools();

  return pageCount;

}