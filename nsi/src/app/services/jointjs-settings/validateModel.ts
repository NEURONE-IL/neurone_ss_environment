import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

export function validateModel(graph: joint.dia.Graph): void {

  let origDiagram = graph.toJSON();
  console.log(origDiagram);

  interface LooseObject {
    [key: string]: any
  }

  var formattedDiagram: LooseObject = {};

  // Creation of node objects
  for (let i = 0; i < origDiagram.cells.length; i++) {

    if (origDiagram.cells[i].type == "standard.BorderedImage") {
      var label = origDiagram.cells[i].attrs.label.text;
      formattedDiagram[label] = {};
    }

  }

  // Addition of link information between nodes
  for (let i = 0; i < origDiagram.cells.length; i++) {

    if (origDiagram.cells[i].type == "link") {

      var probability = origDiagram.cells[i].labels[0].attrs.text.text;

      for (let j = 0; j < origDiagram.cells.length; j++) {

        if (origDiagram.cells[j].id == origDiagram.cells[i].source.id) {
          var sourceNodeLabel = origDiagram.cells[j].attrs.label.text;
        } else if (origDiagram.cells[j].id == origDiagram.cells[i].target.id) {
          var targetNodeLabel = origDiagram.cells[j].attrs.label.text;
        }
      }

      formattedDiagram[sourceNodeLabel][targetNodeLabel] = probability;
      
    }

  }

  console.log(formattedDiagram);

}