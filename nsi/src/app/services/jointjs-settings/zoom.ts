import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

interface zoomInputParameters {
  paper: joint.dia.Paper,
  paperScale: number,
  paperScaleString: string,
  startWidth: number,
  startHeight: number
  startPadding: number
}

interface zoomOutputParameters {
  paper: joint.dia.Paper,
  paperScale: number,
  paperScaleString: string
}

function resizePaper(zoomInputParams: zoomInputParameters): joint.dia.Paper {

  if (zoomInputParams.paperScale < 1) {
    zoomInputParams.paper.fitToContent({
      minWidth: zoomInputParams.startWidth,
      minHeight: zoomInputParams.startHeight,
      padding: zoomInputParams.startPadding
    });
  } else {
    zoomInputParams.paper.fitToContent({
      minWidth: 1000 * zoomInputParams.paperScale,
      minHeight: 400 * zoomInputParams.paperScale,
      padding: 200 * zoomInputParams.paperScale
    });
  };

  return zoomInputParams.paper;

}

export function zoomIn(zoomInputParams: zoomInputParameters): zoomOutputParameters {

  if (zoomInputParams.paperScale < 1.5) {
    zoomInputParams.paperScale += 0.1;
    zoomInputParams.paper.scale(zoomInputParams.paperScale, zoomInputParams.paperScale);
    zoomInputParams.paperScaleString = (zoomInputParams.paperScale * 100).toFixed(0);
  }

  zoomInputParams.paper = resizePaper(zoomInputParams);

  var output = {
    paper: zoomInputParams.paper,
    paperScale: zoomInputParams.paperScale,
    paperScaleString: zoomInputParams.paperScaleString
  }

  return output;
  
}

export function zoomOut(zoomInputParams: zoomInputParameters): zoomOutputParameters {

  if (zoomInputParams.paperScale > 0.6) {
    zoomInputParams.paperScale -= 0.1;
    zoomInputParams.paper.scale(zoomInputParams.paperScale, zoomInputParams.paperScale);
    zoomInputParams.paperScaleString = (zoomInputParams.paperScale * 100).toFixed(0);
  }

  zoomInputParams.paper = resizePaper(zoomInputParams);

  var output = {
    paper: zoomInputParams.paper,
    paperScale: zoomInputParams.paperScale,
    paperScaleString: zoomInputParams.paperScaleString
  }

  return output;

}

export function restoreZoom(zoomInputParams: zoomInputParameters): zoomOutputParameters {

  zoomInputParams.paperScale = 1;
  zoomInputParams.paper.scale(zoomInputParams.paperScale, zoomInputParams.paperScale);
  zoomInputParams.paperScaleString = (zoomInputParams.paperScale * 100).toFixed(0);

  zoomInputParams.paper = resizePaper(zoomInputParams);

  var output = {
    paper: zoomInputParams.paper,
    paperScale: zoomInputParams.paperScale,
    paperScaleString: zoomInputParams.paperScaleString
  }

  return output;

}