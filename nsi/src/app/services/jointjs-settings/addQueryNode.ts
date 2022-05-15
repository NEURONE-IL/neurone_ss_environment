import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

interface jointInputParameters {
  graph: joint.dia.Graph,
  paper: joint.dia.Paper,
  queryCount: number,
  visiblePaperX: number,
  visiblePaperY: number
}

export function addQueryNode(jointInputParams: jointInputParameters): number {
  
  jointInputParams.paper.hideTools();

  jointInputParams.queryCount = jointInputParams.queryCount + 1;

  var queryNode = new joint.shapes.standard.BorderedImage({
    position: {
      x: (jointInputParams.visiblePaperX + 100),
      y: (jointInputParams.visiblePaperY + 30)
    },
    size: {
      width: 150,
      height: 65
    },
    attrs: {
      background: {
        fill: '#b071eb'
      },
      border: {
        stroke: 'black',
        rx: 5,
        ry: 5,
      },
      label: {
        text: '(new query '.concat(jointInputParams.queryCount.toString()).concat(')')
      },
      image: {
        "xlink:href": "/assets/behavior-model-query.png",
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
              width: 10,
              height: 10,
              y: -5,
              x: -5,
              fill: 'black',
              magnet: true
            }
          },
          markup: [{
            tagName: 'rect',
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
              width: 10,
              height: 10,
              y: -5,
              x: -5,
              fill: 'black',
              magnet: true
            }
          },
          markup: [{
            tagName: 'rect',
            selector: 'portBody'
          }]
        },
      }
    }
  });

  queryNode.addPorts([
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

  queryNode.prop('typeNode', 'query');
  queryNode.prop('minTransitionTime', -1);
  queryNode.prop('maxTransitionTime', -1);

  queryNode.addTo(jointInputParams.graph);

  var elementView = queryNode.findView(jointInputParams.paper);

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

  return jointInputParams.queryCount;

}