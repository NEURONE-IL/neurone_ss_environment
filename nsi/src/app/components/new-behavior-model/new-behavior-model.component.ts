import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription, fromEvent } from 'rxjs';

import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NewBehaviorModelProbabilityModalComponent } from '../new-behavior-model-probability-modal/new-behavior-model-probability-modal.component';
import { NewBehaviorModelNodeSettingsEndbookunbookModalComponent } from '../new-behavior-model-node-settings-endbookunbook-modal/new-behavior-model-node-settings-endbookunbook-modal.component';
import { NewBehaviorModelNodeSettingsPageserpModalComponent } from '../new-behavior-model-node-settings-pageserp-modal/new-behavior-model-node-settings-pageserp-modal.component';
import { NewBehaviorModelNodeSettingsQueryModalComponent } from '../new-behavior-model-node-settings-query-modal/new-behavior-model-node-settings-query-modal.component';
import { addStartNode } from '../../services/jointjs-settings/addStartNode';
import { addQueryNode } from '../../services/jointjs-settings/addQueryNode';
import { addSERPNode } from '../../services/jointjs-settings/addSERPNode';
import { addPageNode } from '../../services/jointjs-settings/addPageNode';
import { addBookmarkNode } from '../../services/jointjs-settings/addBookmarkNode';
import { addUnBookmarkNode } from '../../services/jointjs-settings/addUnBookmarkNode';
import { addEndNode } from '../../services/jointjs-settings/addEndNode';
import { convertToJSON } from '../../services/jointjs-settings/convertToJSON';
import { validateModel } from '../../services/jointjs-settings/validateModel';
import { zoomIn, zoomOut, restoreZoom } from '../../services/jointjs-settings/zoom';

@Component({
  selector: 'app-new-behavior-model',
  templateUrl: './new-behavior-model.component.html',
  styleUrls: ['./new-behavior-model.component.css']
})

export class NewBehaviorModelComponent implements OnInit {

  private graph: joint.dia.Graph
  private paper: joint.dia.Paper
  public paperScale: number
  public paperScaleString: string
  private queryCount: number
  private sERPCount: number
  private pageCount: number
  private bookmarkCount: number
  private unBookmarkCount: number
  private endCount: number
  private lastSelectedCell: string
  private startWidth: number
  private startHeight: number
  private startPadding: number
  private scrollTop: number
  private scrollLeft: number
  private visiblePaper: visiblePaper

  constructor(public dialog: MatDialog, public snackbar: MatSnackBar, private elementRef: ElementRef) {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({model: this.graph});
    this.paperScale = 1;
    this.paperScaleString = "100";
    this.queryCount = 0;
    this.sERPCount = 0;
    this.pageCount = 0;
    this.bookmarkCount = 0;
    this.unBookmarkCount = 0;
    this.endCount = 0;
    this.lastSelectedCell = '';
    this.startWidth = 1000;
    this.startHeight = 400;
    this.startPadding = 200;
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.visiblePaper = {x: 0, y: 0}
  }

  ngOnInit(): void {

    var namespace = joint.shapes;    

    this.graph = new joint.dia.Graph({}, { cellNamespace: namespace });

    this.paper = new joint.dia.Paper({
        el: jQuery('#behaviorModelEditor'),
        model: this.graph,
        width: this.startWidth,
        height: this.startHeight,
        gridSize: 10,
        drawGrid: true,
        cellViewNamespace: namespace,
        perpendicularLinks: true,
        linkPinning: true,
        snapLabels: true,
        //snapLinks: { radius: 20 },
        defaultLink: new joint.dia.Link({
          router: { name: 'manhattan' },
          connection: { name: 'rounded' },
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
        //validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        //  return cellViewS != cellViewT;
        //}
    });

    this.paper.setGrid({
        name: 'mesh',
        args: { color: '#dedede' },
    }).drawGrid();

    addStartNode({graph: this.graph, paper: this.paper, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});

    this.paper.on('element:pointerdblclick', (elementView: any) => {
      this.openNodeSettingsModal(elementView);
    });

    this.paper.on('link:pointerdblclick', (linkView: any) => {
      this.openProbabilityModal(linkView);
    });

    this.paper.on('cell:pointerclick cell:pointerdown', (elementView: any) => {
        this.paper.hideTools();
        elementView.showTools();
        this.lastSelectedCell = elementView.id;
    });

    this.paper.on('blank:pointerclick', () => {
        this.paper.hideTools();
    });

    this.graph.on('change:position', (evt: any) => {
      if (this.paperScale < 1) {
        this.paper.fitToContent({
          minWidth: this.startWidth,
          minHeight: this.startHeight,
          padding: this.startPadding
        });
      } else {
        this.paper.fitToContent({
          minWidth: 1000 * this.paperScale,
          minHeight: 400 * this.paperScale,
          padding: 200 * this.paperScale
        });
      };
    });

    this.graph.on('change:source change:target', (link: any) => {
      if (link.get('source').id && link.get('target').id) {

        let diagram = this.graph.toJSON();
        let sourceId = link.get('source').id;
        let sourceTypeNode;
        let targetId = link.get('target').id;
        let targetTypeNode;

        for (let i = 0; i < diagram.cells.length; i++) {
          if (diagram.cells[i].id == sourceId) {
            sourceTypeNode = diagram.cells[i].typeNode
            break;
          }
        }

        for (let i = 0; i < diagram.cells.length; i++) {
          if (diagram.cells[i].id == targetId) {
            targetTypeNode = diagram.cells[i].typeNode
            break;
          }
        }

        // VER SI SE PUEDE IMPLEMENTAR MAGNETISMO

        // FALTA REVISAR LOS CASOS EN QUE SOURCELABEL YA ESTABA LINKEADO A OTRO NODO...

        // Y PONER LAS PROBABILIDADES EN ROJO (O HACER QUE YA NO ESTEN EN ROJO)

        // REVISANDO CUANDO LOS ENLACES EXISTENTES SE CREAN O BORRAN
        // ¿TAL VEZ PASAR TODO ESTO A VALIDATECONNECTION Y ES MAS FACIL MANIPULAR LINKS?

        if (sourceId == targetId) {
          this.graph.getCell(link.id).remove();
          this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
          return;
        }

        if (sourceTypeNode == "start") {
          if (targetTypeNode != "query") {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
          } else {
            //PONER EN 100% Y HACER INMUTABLE
            //this.graph.getCell(link.id).attr('text/text', '100%');
            //this.graph.getCell(link.id).attr('text/fill', 'black');
          }

        } else if (sourceTypeNode == "query") {       
          if ((targetTypeNode != "query") && (targetTypeNode != "page") && (targetTypeNode != "end")) {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
          }

        } else if (sourceTypeNode == "page") {        
          if ((targetTypeNode != "query") && (targetTypeNode != "page") && (targetTypeNode != "bookmark") && (targetTypeNode != "unBookmark") && (targetTypeNode != "end")) {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
          }

        } else if (sourceTypeNode == "bookmark") {      
          if ((targetTypeNode != "query") && (targetTypeNode != "page")) { // ¿¿¿Y TAL VEZ A END???
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
          }

        } else if (sourceTypeNode == "unBookmark") {    
          if ((targetTypeNode != "query") && (targetTypeNode != "page")) { // ¿¿¿Y TAL VEZ A END???
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
          }

        } else if (sourceTypeNode == "end") {         
          this.graph.getCell(link.id).remove();
          this.snackbar.open('Invalid link', '(close)', {duration: 3000, panelClass: 'snackbar-model-error'});
        }

      }
    })

  }

  private openProbabilityModal = (linkView: any) => {
    var currentProbability = linkView.model.attributes.labels[0].attrs.text.text;
    const dialogRef = this.dialog.open(NewBehaviorModelProbabilityModalComponent, { width: '40%', data: { currentProbability: currentProbability } } );
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
      linkView.model.label(0, { attrs: { text: { text: value.concat("%") } } });
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  private openNodeSettingsModal = (elementView: any) => {
    let typeNode = elementView.model.attributes.typeNode
    if (typeNode == "start") {
      return;
    } else if (typeNode == "page") {
      var nodeName = elementView.model.attributes.attrs.label.text;
      var minTransitionTime = elementView.model.attributes.minTransitionTime;
      var maxTransitionTime = elementView.model.attributes.maxTransitionTime;
      var relevantPage = elementView.model.attributes.relevantPage;
      var existingNodeNames = this.getNodeNames();

      const dialogRef = this.dialog.open(NewBehaviorModelNodeSettingsPageserpModalComponent, { width: '49%', data: { nodeName: nodeName, minTransitionTime: minTransitionTime, maxTransitionTime: maxTransitionTime, relevantPage: relevantPage, existingNodeNames: existingNodeNames } } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
        nodeName = value.nodeName;
        minTransitionTime = value.minTransitionTime;
        maxTransitionTime = value.maxTransitionTime;
        relevantPage = value.relevantPage;
        elementView.model.attr('label/text', value.nodeName);
        elementView.model.attributes.minTransitionTime = value.minTransitionTime;
        elementView.model.attributes.maxTransitionTime = value.maxTransitionTime;
        elementView.model.attributes.relevantPage = value.relevantPage;
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else if ((typeNode == "end") || (typeNode == "bookmark") || (typeNode == "unBookmark")) {
      var nodeName = elementView.model.attributes.attrs.label.text;
      var existingNodeNames = this.getNodeNames();

      const dialogRef = this.dialog.open(NewBehaviorModelNodeSettingsEndbookunbookModalComponent, { width: '45%', data: { nodeName: nodeName, existingNodeNames: existingNodeNames } } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
        nodeName = value.nodeName;
        elementView.model.attr('label/text', value.nodeName);
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else if (typeNode == "query") {
      var nodeName = elementView.model.attributes.attrs.label.text;
      var minTransitionTime = elementView.model.attributes.minTransitionTime;
      var maxTransitionTime = elementView.model.attributes.maxTransitionTime;
      var existingNodeNames = this.getNodeNames();

      const dialogRef = this.dialog.open(NewBehaviorModelNodeSettingsQueryModalComponent, { width: '49%', data: { nodeName: nodeName, minTransitionTime: minTransitionTime, maxTransitionTime: maxTransitionTime, existingNodeNames: existingNodeNames } } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
        nodeName = value.nodeName;
        minTransitionTime = value.minTransitionTime;
        maxTransitionTime = value.maxTransitionTime;
        elementView.model.attr('label/text', value.nodeName);
        elementView.model.attributes.minTransitionTime = value.minTransitionTime;
        elementView.model.attributes.maxTransitionTime = value.maxTransitionTime;
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }
  }

  private getNodeNames = (): string[] => {
    let diagram = this.graph.toJSON();
    let nodeNames: string[] = [];

    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type != "link") {
        nodeNames.push(diagram.cells[i].attrs.label.text);
      }
    }

    return nodeNames;
  }

  public addQueryAction = () => {
    this.queryCount = addQueryNode({graph: this.graph, paper: this.paper, queryCount: this.queryCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  public addSERPAction = () => {
    this.sERPCount = addSERPNode({graph: this.graph, paper: this.paper, sERPCount: this.sERPCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  public addPageAction = () => {
    this.pageCount = addPageNode({graph: this.graph, paper: this.paper, pageCount: this.pageCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  public addBookmarkAction = () => {
    this.bookmarkCount = addBookmarkNode({graph: this.graph, paper: this.paper, bookmarkCount: this.bookmarkCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  public addUnBookmarkAction = () => {
    this.unBookmarkCount = addUnBookmarkNode({graph: this.graph, paper: this.paper, unBookmarkCount: this.unBookmarkCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  public addEndAction = () => {
    this.endCount = addEndNode({graph: this.graph, paper: this.paper, endCount: this.endCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  public toJSONAction = () => {
    convertToJSON(this.graph);
  }

  public validateModelAction = () => {
    validateModel(this.graph);
  }

  public zoomInAction = () => {
    var output = zoomIn({paper: this.paper, paperScale: this.paperScale, paperScaleString: this.paperScaleString, startWidth: this.startWidth, startHeight: this.startHeight, startPadding: this.startPadding});
    this.paper = output.paper;
    this.paperScale = output.paperScale;
    this.paperScaleString = output.paperScaleString;
  }

  public zoomOutAction = () => {
    var output = zoomOut({paper: this.paper, paperScale: this.paperScale, paperScaleString: this.paperScaleString, startWidth: this.startWidth, startHeight: this.startHeight, startPadding: this.startPadding});
    this.paper = output.paper;
    this.paperScale = output.paperScale;
    this.paperScaleString = output.paperScaleString;
  }

  public restoreZoomAction = () => {
    var output = restoreZoom({paper: this.paper, paperScale: this.paperScale, paperScaleString: this.paperScaleString, startWidth: this.startWidth, startHeight: this.startHeight, startPadding: this.startPadding});
    this.paper = output.paper;
    this.paperScale = output.paperScale;
    this.paperScaleString = output.paperScaleString;
  }

  public onScroll(event: Event): void {
    const element = (event.target as HTMLDivElement);
    this.scrollTop = element.scrollTop;
    this.scrollLeft = element.scrollLeft;
    this.visiblePaper.x = this.scrollLeft;
    this.visiblePaper.y = this.scrollTop;
  }

}

interface visiblePaper {
  x: number,
  y: number
}