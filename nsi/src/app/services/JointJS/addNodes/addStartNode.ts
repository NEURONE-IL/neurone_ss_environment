import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

// Interface which contains the data needed to add a start node to a behavior model
interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  visiblePaperX: number,
  visiblePaperY: number
}

// Adds a start node to a behavior model (the graph and paper, provided as part of the input, will be modified directly, as they are passed by reference)
export function addStartNode(jointInputParams: jointInputParameters): any {

  let startText = $localize`:Name of a start node in the New Behavior Model component:Start`;
  
  jointInputParams.paper.hideTools();

  var startNode = new joint.shapes.standard.BorderedImage({
    position: {
      x: (jointInputParams.visiblePaperX + 100),
      y: (jointInputParams.visiblePaperY + 30)
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
        fill: 'turquoise'
      },
      border: {
        stroke: 'black',
        rx: 5,
        ry: 5,
      },
      label: {
        text: startText
      },
      image: {
        "xlink:href": "/assets/behaviormodel-start.png",
        refWidth: 0.7,
        refHeight: 0.7,
        refX: 0.15,
        refY: 0.15
      }
    },
    ports: {
      groups: {
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

  startNode.addPorts([
      {
          group: 'rightPorts',
          id: 'rightPort',
          attrs: { label: { text: 'rightPort' }}
      },
  ]);

  startNode.prop('typeNode', 'start');

  startNode.addTo(jointInputParams.graph);

  var elementView = startNode.findView(jointInputParams.paper);

  var boundaryTool = new joint.elementTools.Boundary();

  var toolsView = new joint.dia.ToolsView({
      tools: [
          boundaryTool
      ]
  });

  elementView.addTools(toolsView);
  elementView.hideTools();
  
  return startNode.id;

}