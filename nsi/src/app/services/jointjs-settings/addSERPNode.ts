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

  jointInputParams.sERPCount = jointInputParams.sERPCount + 1;

  var sERPNode = new joint.shapes.standard.BorderedImage({
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
        fill: '#C9A09D'
      },
      border: {
        stroke: 'black',
        rx: 5,
        ry: 5,
      },
      label: {
        text: '(new SERP '.concat(jointInputParams.sERPCount.toString()).concat(')')
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

  return jointInputParams.sERPCount;

}