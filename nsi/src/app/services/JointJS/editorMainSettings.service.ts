import { Injectable } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

// Interface which contains the input data needed to change the zoom of the behavior model diagram editor
interface zoomInputParameters {
  paper: joint.dia.Paper,
  paperScale: number,
  paperScaleString: string,
  modelWidth: number,
  modelHeight: number
}

// Interface which contains the output data after a zoom change has been performed on the behavior model diagram editor
interface zoomOutputParameters {
  paper: joint.dia.Paper,
  paperScale: number,
  paperScaleString: string
}

@Injectable({
  providedIn: 'root'
})

// Offers settings and methods to initialize the graph and the paper in the behavior model editor, as well as handling zoom actions
export class EditorMainSettingsService {

	// Key diagram settings (they affect all model editors in the interface)
	public static editorWidth = 1000;		// Width of the model editor
	public static editorHeight = 400;		// Height of the model editor
  public static editorPadding = 300;	// Padding that the model editor will apply to the diagram (how much the editor will increase the area of the diagram when an object gets close to an edge of it)

	// Initializes the paper for the behavior model editor, with its basic settings
	initializePaper(graph: joint.dia.Graph, modelWidth: number, modelHeight: number, namespace: object): joint.dia.Paper {
		let paper = new joint.dia.Paper({
      el: jQuery('#behaviorModelEditor'),
      model: graph,
      width: modelWidth,
      height: modelHeight,
      gridSize: 10,
      drawGrid: true,
      cellViewNamespace: namespace,
      perpendicularLinks: true,
      linkPinning: true,
      snapLabels: true,
      snapLinks: { radius: 20 },
      defaultLink: new joint.dia.Link({
        router: { name: 'manhattan' },
        connection: { name: 'rounded' },
        connector: { name: "jumpover" },
        attrs: {
          '.connection': {
            'stroke-width': 2,
          },
          '.marker-target': {
            d: 'M 10 0 L 0 5 L 10 10 z',
            'fill': 'blue',
            'stroke': 'blue'
          },
        },
        labels: [
          { position: 0.5, attrs: { text: { text: '(no value)', fill: 'red' } } }
        ]
      }),
      interactive: { useLinkTools: true, labelMove: true },
  	});

    paper.setGrid({
      name: 'mesh',
      args: { color: '#dedede' },
    }).drawGrid();

    return paper;
	}

	// Restores the element tools (including a delete button) to each existing node - The element tools are displayed when clicking on a node
	restoreElementToolsForEdit(graph: joint.dia.Graph, paper: joint.dia.Paper): joint.dia.Graph {
		let cells = graph.getCells();
	    for (let i = 0; i < cells.length; i++) {
	      if (cells[i].attributes['type'] != "link" && cells[i].attributes['typeNode'] !== "start") {
	        var elementView = cells[i].findView(paper);
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
	      }

	      else if (cells[i].attributes['typeNode'] === "start") {
	        var elementView = cells[i].findView(paper);
	        var boundaryTool = new joint.elementTools.Boundary();

	        var toolsView = new joint.dia.ToolsView({
	          tools: [
	            boundaryTool,
	          ]
	        });
	        elementView.addTools(toolsView);
	        elementView.hideTools();
	      }
	    }

	    return graph;
	}

	// Computes the relevant values to zoom out of the model editor
	resizePaper(zoomInputParams: zoomInputParameters): joint.dia.Paper {
	  if (zoomInputParams.paperScale < 1) {
	    zoomInputParams.paper.fitToContent({
	      minWidth: zoomInputParams.modelWidth,
	      minHeight: zoomInputParams.modelHeight,
	      padding: EditorMainSettingsService.editorPadding
	    });
	  } else {
	    zoomInputParams.paper.fitToContent({
	      minWidth: EditorMainSettingsService.editorWidth * zoomInputParams.paperScale,
	      minHeight: EditorMainSettingsService.editorHeight * zoomInputParams.paperScale,
	      padding: EditorMainSettingsService.editorPadding * zoomInputParams.paperScale
	    });
	  };

	  return zoomInputParams.paper;
	}

	// Computes the relevant values to zoom into the model editor
	zoomIn(zoomInputParams: zoomInputParameters): zoomOutputParameters {
	  if (zoomInputParams.paperScale < 1.5) {
	    zoomInputParams.paperScale += 0.1;
	    zoomInputParams.paper.scale(zoomInputParams.paperScale, zoomInputParams.paperScale);
	    zoomInputParams.paperScaleString = (zoomInputParams.paperScale * 100).toFixed(0);
	  }

	  zoomInputParams.paper = this.resizePaper(zoomInputParams);

	  var output = {
	    paper: zoomInputParams.paper,
	    paperScale: zoomInputParams.paperScale,
	    paperScaleString: zoomInputParams.paperScaleString
	  }

	  return output;
	}

	// Computes the relevant values to zoom out of the model editor
	zoomOut(zoomInputParams: zoomInputParameters): zoomOutputParameters {
	  if (zoomInputParams.paperScale > 0.6) {
	    zoomInputParams.paperScale -= 0.1;
	    zoomInputParams.paper.scale(zoomInputParams.paperScale, zoomInputParams.paperScale);
	    zoomInputParams.paperScaleString = (zoomInputParams.paperScale * 100).toFixed(0);
	  }

	  zoomInputParams.paper = this.resizePaper(zoomInputParams);

	  var output = {
	    paper: zoomInputParams.paper,
	    paperScale: zoomInputParams.paperScale,
	    paperScaleString: zoomInputParams.paperScaleString
	  }

	  return output;
	}

	// Computes the relevant values to restore the default zoom of the model editor
	restoreZoom(zoomInputParams: zoomInputParameters): zoomOutputParameters {
	  zoomInputParams.paperScale = 1;
	  zoomInputParams.paper.scale(zoomInputParams.paperScale, zoomInputParams.paperScale);
	  zoomInputParams.paperScaleString = (zoomInputParams.paperScale * 100).toFixed(0);

	  zoomInputParams.paper = this.resizePaper(zoomInputParams);

	  var output = {
	    paper: zoomInputParams.paper,
	    paperScale: zoomInputParams.paperScale,
	    paperScaleString: zoomInputParams.paperScaleString
	  }

	  return output;
	}

}