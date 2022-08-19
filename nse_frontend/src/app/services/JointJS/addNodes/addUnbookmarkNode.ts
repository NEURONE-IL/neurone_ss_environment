import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

// Interface which contains the data needed to add an unbookmark node to a behavior model
interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  unbookmarkCount: number,
  visiblePaperX: number,
  visiblePaperY: number
}

// Adds an unbookmark node to a behavior model (the graph and paper, provided as part of the input, will be modified directly, as they are passed by reference)
export function addUnbookmarkNode(jointInputParams: jointInputParameters): number {

  let newUnbookmarkText = $localize`:Default name of a new unbookmark node in the New Behavior Model and Behavior Model Edit components:New unbookmark`;
  
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

  let unbookmarkCount = jointInputParams.unbookmarkCount;
  unbookmarkCount = unbookmarkCount + 1;

  let text = newUnbookmarkText + ' ' + unbookmarkCount.toString();

  let textValid = false;
  while (!textValid) {
    textValid = true;
    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type !== "link") {
        if (diagram.cells[i].attrs.label.text === text) {
          textValid = false;
          unbookmarkCount = unbookmarkCount + 1;
          text = newUnbookmarkText.concat(' ' + unbookmarkCount.toString());
        }
      }
    }
  }

  var unbookmarkNode = new joint.shapes.standard.BorderedImage({
    position: {
      x: positionX,
      y: positionY
    },
    size: {
      width: 65,
      height: 65
    },
    attrs: {
      root: {
        magnet: false
      },
      background: {
        fill: '#96bed4'
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
        "xlink:href": "/assets/behaviormodel-unbookmark.png",
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

  unbookmarkNode.addPorts([
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

  unbookmarkNode.prop('typeNode', 'unbookmark');

  unbookmarkNode.addTo(jointInputParams.graph);

  var elementView = unbookmarkNode.findView(jointInputParams.paper);

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

  return unbookmarkCount;

}