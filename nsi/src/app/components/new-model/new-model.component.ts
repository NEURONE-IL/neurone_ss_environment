import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewModelProbabilityModalComponent } from '../new-model-probability-modal/new-model-probability-modal.component';

@Component({
  selector: 'app-new-model',
  templateUrl: './new-model.component.html',
  styleUrls: ['./new-model.component.css']
})

export class NewModelComponent implements OnInit, AfterViewInit {

  private graph: any
  private pageCount: number
  private queryCount: number
  private bookmarkCount: number
  private unBookmarkCount: number
  private endCount: number
  private paper: any
  //
  private dragStartPositionX: number
  private dragStartPositionY: number
  private dragging: boolean

  constructor(public dialog: MatDialog) {
    this.pageCount = 0;
    this.queryCount = 0;
    this.bookmarkCount = 0;
    this.unBookmarkCount = 0;
    this.endCount = 0;
    this.paper = {};
    //
    this.dragStartPositionX = -1;
    this.dragStartPositionY = -1;
    this.dragging = false;
  }

  openDialog(linkView: any) {
    const dialogRef = this.dialog.open(NewModelProbabilityModalComponent, {width: '25%'});
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
      console.log(linkView);
      linkView.model.label(0, { attrs: { text: { text: value } } });
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    var namespace = joint.shapes;    

    this.graph = new joint.dia.Graph({}, { cellNamespace: namespace });

    this.paper = new joint.dia.Paper({
        el: jQuery('#modelEditor'),
        model: this.graph,
        width: 1000,
        height: 400,
        gridSize: 10,
        drawGrid: true,
        cellViewNamespace: namespace,
        perpendicularLinks: true,
        linkPinning: true,
        snapLabels: true,
        defaultLink: new joint.dia.Link({
          router: { name: 'manhattan' },
          connection: { name: 'rounded' },
          attrs: {
            '.connection': {
              'stroke-width': 2
            },
            '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
          },
          labels: [
            { position: 0.5, attrs: { text: { text: '(probability required)' } } }
          ]
        }),
        interactive: { vertexAdd: false, useLinkTools: true, labelMove: true }
    });

    this.paper.setGrid({
        name: 'mesh',
        args: { color: '#dedede' },
    }).drawGrid();

    console.log(this.paper);

    // paper.on('blank:pointerdown',
    //     function(event, x, y) {
    //       dragging = true;
    //       this.dragStartPositionX = x;
    //       this.dragStartPositionY = y;
    //       console.log("INICIO SELECCION");
    //     }
    // );

    // paper.on('cell:pointerup blank:pointerup',
    //   function(cellView, x, y) {
    //     console.log("FIN SELECCION");
    //     dragging = false;
    // }),
      
    this.paper.on('cell:pointerclick', function(cellView: any) {
      console.log(cellView);
      //var ports = cellView.getPorts();
      //cellView.portProp(ports[0], 'attrs/rect', {stroke: 'red'});
      //this.portProp(topPorts[0], 'attrs/rect', {stroke: 'red'});
    });

    this.paper.on('link:pointerdblclick', (linkView: any) => {
      this.openDialog(linkView);
    });

    this.paper.on('cell:pointerclick', (elementView: any) => {
        this.paper.hideTools();
        elementView.showTools();
    });

    this.paper.on('blank:pointerclick', () => {
        this.paper.hideTools();
    });

  }

  ngAfterViewInit() {
  }

/*  COSAS POR HACER:
QUITAR CREACION DE CODOS DE FLECHAS, SIMPLIFICAR FLECHAS (SIN ESQUINAS DE COLORES)
QUE LAS FLECHAS A CREAR TENGAN COMO DESTINO SOLO LOS PUERTOS, NO EL CUERPO DEL ELEMENTO
QUE LOS PUERTOS DE UN NODO SE VEAN AL SELECCIONARLO, Y SE OCULTEN AL SELECCIONAR CUALQUIER OTRA COSA
QUE LOS PUERTOS NO SE LINKEEN CONSIGO MISMOS
DIAGRAMA SCROLLABLE
AL SELECCIONAR NODO, TIENE QUE PONERSE ENCIMA DE LOS DEMÁS
ARREGLAR FORMATO DE SELECCION DE FLECHAS
SELECCIONAR VARIOS NODOS, Y PODER MOVERLOS O BORRARLOS
UNDO, REDO
SAVE AS PNG?
QUE UN PUERTO PUEDA TENER SOLO UN LINK (VALIDATECONNECTION)
PROBABILIDAD EN PORCENTAJE
*/
  addPageNode(): void {
    
    this.paper.hideTools();

    this.pageCount = this.pageCount + 1;

    var pageNode = new joint.shapes.standard.BorderedImage({
      position: {
        x: 100,
        y: 30
      },
      size: {
        width: 150,
        height: 65
      },
      attrs: {
        background: {
          fill: 'lightgrey'
        },
        border: {
          stroke: 'black',
          rx: 5,
          ry: 5,
        },
        // body: {
        //     //magnet: true
        // },
        label: {
          text: 'P'.concat(this.pageCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/model_page.png",
          refWidth: 0.7,
          refHeight: 0.7,
          refX: 0.15,
          refY: 0.15
        }
      },
      ports: {
        groups: {
          'topPorts': {
            position: 'top',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
          'bottomPorts': {
            position: 'bottom',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
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
                fill: 'green',
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
                fill: 'green',
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

    pageNode.addPorts([
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort1' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort2' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort3' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort1' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort2' }}
        },
        { 
            group: 'leftPorts',
            attrs: { label: { text: 'leftPort' }}
        },
        { 
            group: 'rightPorts',
            attrs: { label: { text: 'rightPort' }}
        },
    ]);

    pageNode.addTo(this.graph);

    var elementView = pageNode.findView(this.paper);

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

  addQueryNode(): void {
    
    this.paper.hideTools();

    this.queryCount = this.queryCount + 1;

    var queryNode = new joint.shapes.standard.BorderedImage({
      position: {
        x: 100,
        y: 30
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
        // body: {
        //     //magnet: true
        // },
        label: {
          text: 'Q'.concat(this.queryCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/model_query.png",
          refWidth: 0.7,
          refHeight: 0.7,
          refX: 0.15,
          refY: 0.15
        }
      },
      ports: {
        groups: {
          'topPorts': {
            position: 'top',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
          'bottomPorts': {
            position: 'bottom',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
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
                fill: 'green',
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
                fill: 'green',
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
            group: 'topPorts',
            attrs: { label: { text: 'topPort1' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort2' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort3' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort1' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort2' }}
        },
        { 
            group: 'leftPorts',
            attrs: { label: { text: 'leftPort' }}
        },
        { 
            group: 'rightPorts',
            attrs: { label: { text: 'rightPort' }}
        },
    ]);

    queryNode.addTo(this.graph);

    var elementView = queryNode.findView(this.paper);

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

  addBookmarkNode(): void {
    
    this.paper.hideTools();

    this.bookmarkCount = this.bookmarkCount + 1;

    var bookmarkNode = new joint.shapes.standard.BorderedImage({
      position: {
        x: 100,
        y: 30
      },
      size: {
        width: 65,
        height: 65
      },
      attrs: {
        background: {
          fill: '#96bed4'
        },
        border: {
          stroke: 'black',
          rx: 5,
          ry: 5,
        },
        // body: {
        //     //magnet: true
        // },
        label: {
          text: 'B'.concat(this.bookmarkCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/model_bookmark.png",
          refWidth: 0.7,
          refHeight: 0.7,
          refX: 0.15,
          refY: 0.15
        }
      },
      ports: {
        groups: {
          'topPorts': {
            position: 'top',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
          'bottomPorts': {
            position: 'bottom',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
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
                fill: 'green',
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
                fill: 'green',
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

    bookmarkNode.addPorts([
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort1' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort2' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort1' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort2' }}
        },
        { 
            group: 'leftPorts',
            attrs: { label: { text: 'leftPort' }}
        },
        { 
            group: 'rightPorts',
            attrs: { label: { text: 'rightPort' }}
        },
    ]);

    bookmarkNode.addTo(this.graph);

    var elementView = bookmarkNode.findView(this.paper);

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

  addUnBookmarkNode(): void {
    
    this.paper.hideTools();

    this.unBookmarkCount = this.unBookmarkCount + 1;

    var unBookmarkNode = new joint.shapes.standard.BorderedImage({
      position: {
        x: 100,
        y: 30
      },
      size: {
        width: 65,
        height: 65
      },
      attrs: {
        background: {
          fill: '#96bed4'
        },
        border: {
          stroke: 'black',
          rx: 5,
          ry: 5,
        },
        // body: {
        //     //magnet: true
        // },
        label: {
          text: 'U'.concat(this.unBookmarkCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/model_unbookmark.png",
          refWidth: 0.7,
          refHeight: 0.7,
          refX: 0.15,
          refY: 0.15
        }
      },
      ports: {
        groups: {
          'topPorts': {
            position: 'top',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
          'bottomPorts': {
            position: 'bottom',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
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
                fill: 'green',
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
                fill: 'green',
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

    unBookmarkNode.addPorts([
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort1' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort2' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort1' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort2' }}
        },
        { 
            group: 'leftPorts',
            attrs: { label: { text: 'leftPort' }}
        },
        { 
            group: 'rightPorts',
            attrs: { label: { text: 'rightPort' }}
        },
    ]);

    unBookmarkNode.addTo(this.graph);

    var elementView = unBookmarkNode.findView(this.paper);

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

  addEndNode(): void {
    
    this.paper.hideTools();

    this.endCount = this.endCount + 1;

    var endNode = new joint.shapes.standard.BorderedImage({
      position: {
        x: 100,
        y: 30
      },
      size: {
        width: 150,
        height: 65
      },
      attrs: {
        background: {
          fill: 'yellow'
        },
        border: {
          stroke: 'black',
          rx: 5,
          ry: 5,
        },
        // body: {
        //     //magnet: true
        // },
        label: {
          text: 'E'.concat(this.endCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/model_end.png",
          refWidth: 0.7,
          refHeight: 0.7,
          refX: 0.15,
          refY: 0.15
        }
      },
      ports: {
        groups: {
          'topPorts': {
            position: 'top',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
          'bottomPorts': {
            position: 'bottom',
            label: {
              position: 'outside'
            },
            attrs: {
              portBody: {
                width: 10,
                height: 10,
                y: -5,
                x: -5,
                fill: 'green',
                magnet: true
              }
            },
            markup: [{
              tagName: 'rect',
              selector: 'portBody'
            }]
          },
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
                fill: 'green',
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
                fill: 'green',
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

    endNode.addPorts([
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort1' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort2' }}
        },
        { 
            group: 'topPorts',
            attrs: { label: { text: 'topPort3' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort1' }}
        },
        { 
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort2' }}
        },
        { 
            group: 'leftPorts',
            attrs: { label: { text: 'leftPort' }}
        },
        { 
            group: 'rightPorts',
            attrs: { label: { text: 'rightPort' }}
        },
    ]);

    endNode.addTo(this.graph);

    var elementView = endNode.findView(this.paper);

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

}

//     function convertToJSON() {
//         const JSONTextItem = document.getElementById('JSONtext');
//         JSONTextItem.innerHTML = "";
//         JSONTextItem.insertAdjacentText('beforeend', JSON.stringify(graph.toJSON()));
//     }
// </script>