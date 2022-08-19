import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

// Interface which contains the data needed to add a SERP node to a behavior model
interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  SERPCount: number,
  visiblePaperX: number,
  visiblePaperY: number,
}

// Adds a SERP node to a behavior model (the graph and paper, provided as part of the input, will be modified directly, as they are passed by reference)
export function addSERPNode(jointInputParams: jointInputParameters): number {

  let newSERPText = $localize`:Default name of a new SERP node in the New Behavior Model and Behavior Model Edit components:New SERP`;

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

  let SERPCount = jointInputParams.SERPCount;
  SERPCount = SERPCount + 1;

  let text = 'New SERP '.concat(SERPCount.toString());

  let textValid = false;
  while (!textValid) {
    textValid = true;
    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type !== "link") {
        if (diagram.cells[i].attrs.label.text === text) {
          textValid = false;
          SERPCount = SERPCount + 1;
          text = 'New SERP' + ' ' + SERPCount.toString();
        }
      }
    }
  }

  var SERPNode = new joint.shapes.standard.BorderedImage({
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
        "xlink:href": "/assets/behaviormodel-serp.png",
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

  SERPNode.addPorts([
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

  SERPNode.prop('typeNode', 'page'); // SERP nodes are treated as regular pages, because currently, the student simulator does not distinguish between SERP pages and regular pages
  SERPNode.prop('minTransitionTime', -1);
  SERPNode.prop('maxTransitionTime', -1);
  SERPNode.prop('relevantPage', false);

  SERPNode.addTo(jointInputParams.graph);

  var elementView = SERPNode.findView(jointInputParams.paper);

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

  return SERPCount;

}