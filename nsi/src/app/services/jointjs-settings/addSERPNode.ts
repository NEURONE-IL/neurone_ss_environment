import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  sERPCount: number,
  visiblePaperX: number,
  visiblePaperY: number,
}

export function addSERPNode(jointInputParams: jointInputParameters): number {
  
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

  let sERPCount = jointInputParams.sERPCount;
  sERPCount = sERPCount + 1;

  let text = '(new SERP '.concat(sERPCount.toString()).concat(')');

  let textValid = false;
  while (!textValid) {
    textValid = true;
    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type !== "link") {
        if (diagram.cells[i].attrs.label.text === text) {
          textValid = false;
          sERPCount = sERPCount + 1;
          text = '(new SERP '.concat(sERPCount.toString()).concat(')');
        }
      }
    }
  }

  var sERPNode = new joint.shapes.standard.BorderedImage({
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
        fill: '#C9A09D'
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
        "xlink:href": "/assets/behavior-model-serp.png",
        refWidth: 0.85,
        refHeight: 0.85,
        refX: 0.08,
        refY: 0.1
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

  sERPNode.addPorts([
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

  sERPNode.prop('typeNode', 'page');
  sERPNode.prop('minTransitionTime', -1);
  sERPNode.prop('maxTransitionTime', -1);
  sERPNode.prop('relevantPage', false);

  sERPNode.addTo(jointInputParams.graph);

  var elementView = sERPNode.findView(jointInputParams.paper);

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

  return sERPCount;

}