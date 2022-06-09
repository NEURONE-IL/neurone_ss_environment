import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  visiblePaperX: number,
  visiblePaperY: number
}

export function addStartNode(jointInputParams: jointInputParameters): void {
  
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
        text: 'Start'
      },
      image: {
        "xlink:href": "/assets/behavior-model-start.png",
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
          attrs: { label: { text: 'rightPort1' }}
      },
  ]);

  startNode.prop('typeNode', 'start');

  startNode.addTo(jointInputParams.graph);

  var elementView = startNode.findView(jointInputParams.paper);

  var boundaryTool = new joint.elementTools.Boundary();

  var toolsView = new joint.dia.ToolsView({
      tools: [
          boundaryTool,
      ]
  });

  elementView.addTools(toolsView);
  elementView.hideTools();

}