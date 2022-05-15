import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

// This function is executed once the diagram has been validated (in another method)
export function convertToJSON(graph: joint.dia.Graph): void {

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

      if (label.charAt(0) != "E") {
        formattedDiagram[label] = {["T"]: 0}; // SE AGREGA ALTIRO LA TRANSICION A T - ATENCION FORMATO "0.0"
      }
    }

  }

  // Addition of link information between nodes
  for (let i = 0; i < origDiagram.cells.length; i++) {

    if (origDiagram.cells[i].type == "link") {

      var origProbability = origDiagram.cells[i].labels[0].attrs.text.text;
      var formattedProbability = parseInt(origProbability.slice(0, -1)) / 100;

      for (let j = 0; j < origDiagram.cells.length; j++) {

        if (origDiagram.cells[j].id == origDiagram.cells[i].source.id) {
          var sourceNodeLabel = origDiagram.cells[j].attrs.label.text;
        } else if (origDiagram.cells[j].id == origDiagram.cells[i].target.id) {
          var targetNodeLabel = origDiagram.cells[j].attrs.label.text;
        }
      }

      if (targetNodeLabel.charAt(0) != "E") {
        formattedDiagram[sourceNodeLabel][targetNodeLabel] = formattedProbability;
      } else {
        formattedDiagram[sourceNodeLabel]["T"] = formattedProbability;
      }
      
    }

  }

  console.log(formattedDiagram);

}