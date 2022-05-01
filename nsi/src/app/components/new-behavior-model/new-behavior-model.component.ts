/*  COSAS POR HACER:
-REVISAR ORDEN DEL CODIGO:
  -NEW-BEHAVIOR-MODEL
  -STYLE DE APP-COMPONENT
-TERMINAR FORMULARIO DE NUEVA SIMULACION Y AGREGAR VALIDACION
-AGREGAR ICONOS DE DESPLIEGUE, COPIA Y BORRADO (Y HACER FUNCIONAR LOS DOS ULTIMOS)
-TERMINAR LAS OTRAS VISTAS (PRIMERO FRONTEND)
-HACER QUE RUTAS DE ACCESO A BACKEND Y SIMULADOR ESTÉN PARAMETRIZADAS EN FRONTEND
-INTERNACIONALIZACIÓN I18

DIAGRAMAS:
-¿FALTA NODO DE INICIO? (SIN NUMEROS INCREMENTALES)
-ORDENAR ICONOS DE TOOLBAR
-CREAR FUNCION DE CONVERSION A JSON PARA SIMULADOR
-CAMBIAR NOMBRE PROBABILIDAD
-PROBABILIDADES EN ROJO CUANDO FALTEN
-VALIDAR PROBABILIDAD EN MODAL

-QUE NOMBRES DE FUNCS DE EVENTOS EMPIECEN CON ON
-SIMPLIFICAR FLECHAS (SIN ESQUINAS DE COLORES)
-QUE LAS FLECHAS A CREAR TENGAN COMO DESTINO SOLO LOS PUERTOS, NO EL CUERPO DEL ELEMENTO
-ARREGLAR FORMATO DE SELECCION DE FLECHAS
-SELECCIONAR VARIOS NODOS, Y PODER MOVERLOS O BORRARLOS
-UNDO, REDO
-SAVE AS PNG?
-QUE UN PUERTO PUEDA TENER SOLO UN LINK (VALIDATECONNECTION)
-NODO DE PAGINAS DE RESULTADOS
-ZOOM?
-NUMEROS DE NODOS DESPUES DE BORRAR
-REDIRECT TO NEAREST PORT?
*/

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewBehaviorModelProbabilityModalComponent } from '../new-behavior-model-probability-modal/new-behavior-model-probability-modal.component';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-new-behavior-model',
  templateUrl: './new-behavior-model.component.html',
  styleUrls: ['./new-behavior-model.component.css']
})

export class NewBehaviorModelComponent implements OnInit, AfterViewInit {

  public paperScale: number
  public paperScaleString: string
  private graph: any
  private pageCount: number
  private queryCount: number
  private bookmarkCount: number
  private unBookmarkCount: number
  private endCount: number
  private paper: any
  private lastSelectedCell: string
  //
  private startWidth: number
  private startHeight: number
  private startPadding: number

  constructor(public dialog: MatDialog) {
    this.paperScale = 1;
    this.paperScaleString = "100";
    this.pageCount = 0;
    this.queryCount = 0;
    this.bookmarkCount = 0;
    this.unBookmarkCount = 0;
    this.endCount = 0;
    this.paper = {};
    this.lastSelectedCell = '';
    //
    this.startWidth = 1000;
    this.startHeight = 400;
    this.startPadding = 200;
  }

  openDialog(linkView: any) {
    var currentProbability = linkView.model.attributes.labels[0].attrs.text.text;
    const dialogRef = this.dialog.open(NewBehaviorModelProbabilityModalComponent, { width: '25%', data: { currentProbability: currentProbability } } );
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
      linkView.model.label(0, { attrs: { text: { text: value.concat("%") } } });
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
        interactive: { useLinkTools: true, labelMove: true }
    });

    this.paper.setGrid({
        name: 'mesh',
        args: { color: '#dedede' },
    }).drawGrid();

    console.log(this.paper);

        //PAPEL DRAGGABLE (NO FUNCIONA TOTALMENTE)
    // this.paper.on('blank:pointerdown',
    //   (event: any, x: any, y: any) => {
    //     this.dragStartPosition = { x:x, y:y };
    //   }
    // );

    // this.paper.on('cell:pointerup blank:pointerup', (cellView: any, x: any, y: any) => {
    //     this.dragStartPosition = { x:-1, y:-1 };
    // }),

    // jQuery("#behaviorModelEditor")
    //   .mousemove((event: any) => {
    //     console.log(event);
    //     if ((this.dragStartPosition.x != -1) && (this.dragStartPosition.y != -1)) {
    //       this.paper.translate(
    //         event.offsetX - this.dragStartPosition.x, 
    //         event.offsetY - this.dragStartPosition.y);
    //     }
    // });

    // this.paper.on('cell:pointerclick', (cellView: any) => {

        //CAMBIO DE COLOR DE PUERTOS (NO FUNCIONA TOTALMENTE)
    //   if (this.lastSelectedCell != '') {
    //     var cells = this.graph.getCells();
    //     console.log(cells);
    //     var cell = cells.filter((obj:any) => {
    //       return obj.id === this.lastSelectedCell
    //     })
    //     console.log(cell);
    //     console.log("WOW");
    //     var portsToHide = cell.model.getPorts();
    //     var portIdsToHide = [];
    //     for (let i = 0; i < portsToHide.length; i++) {
    //       portIdsToHide.push(portsToHide[i].id);
    //     }
    //     for (let i = 0; i < portIdsToHide.length; i++) {
    //       cellView.model.portProp(portIdsToHide[i], 'attrs/portBody/opacity', 0);
    //     }
    //   }

    //   var portsToShow = cellView.model.getPorts();
    //   var portIdsToShow = [];
    //   for (let i = 0; i < portsToShow.length; i++) {
    //     portIdsToShow.push(portsToShow[i].id);
    //   }
    //   for (let i = 0; i < portIdsToShow.length; i++) {
    //     cellView.model.portProp(portIdsToShow[i], 'attrs/portBody/opacity', 1);
    //   }
    //   cellView.model.toFront();
    //   _.invoke(this.graph.getConnectedLinks(cellView.model), 'toFront');

    // });

    this.paper.on('link:pointerdblclick', (linkView: any) => {
      this.openDialog(linkView);
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

    //var verticesTool = new joint.linkTools.Vertices();
    //var toolsView = new joint.dia.ToolsView({
    //    tools: [
    //        verticesTool
    //    ]
    //});

    //this.paper.on('link:mouseenter', (linkView: any) => {
    //  linkView.addTools(toolsView);
    //});

    //this.paper.on('link:mouseleave', (linkView: any) => {
    //  linkView.removeTools();
    //});

    // this.paper.on ('change:position', function() {
    //    var l_portsIn = get ('inPorts');
    //    if (l_portsIn.length>0) {
    //        this.portProp (l_portsIn[0],'attrs/rect',{stroke: 'red' });
    //    }
    // }

  }

  ngAfterViewInit() {
  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      console.log("DELIT");

    }
  }

  addPageNode(): void {
    
    this.paper.hideTools();

    var localPoint1 = this.paper.clientOffset();
    console.log(localPoint1);

    this.pageCount = this.pageCount + 1;

    var pageNode = new joint.shapes.standard.BorderedImage({
      position: {
        x: Math.round(localPoint1.x) - 100,
        y: Math.round(localPoint1.y) - 30
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
        body: {
          magnet: false
        },
        label: {
          text: 'P'.concat(this.pageCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/behavior-model-page.png",
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

    pageNode.addPorts([
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
          "xlink:href": "/assets/behavior-model-bookmark.png",
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

    bookmarkNode.addPorts([
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
        label: {
          text: 'U'.concat(this.unBookmarkCount.toString()),
          fill: 'black'
        },
        image: {
          "xlink:href": "/assets/behavior-model-unbookmark.png",
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

    unBookmarkNode.addPorts([
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
          "xlink:href": "/assets/behavior-model-end.png",
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

    endNode.addPorts([
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

  convertToJSON(): void {
    console.log(JSON.stringify(this.graph.toJSON()));
  }

  zoomIn(): void {
    if (this.paperScale < 1.5) {
      this.paperScale += 0.1;
      this.paper.scale(this.paperScale, this.paperScale);
      this.paperScaleString = (this.paperScale * 100).toFixed(0);
    }
  }

  zoomOut(): void {
    if (this.paperScale > 0.6) {
      this.paperScale -= 0.1;
      this.paper.scale(this.paperScale, this.paperScale);
      this.paperScaleString = (this.paperScale * 100).toFixed(0);
    }
  }

  restoreZoom(): void {
    this.paperScale = 1;
    this.paper.scale(this.paperScale, this.paperScale);
    this.paperScaleString = (this.paperScale * 100).toFixed(0);
  }

  onScroll(evt:Event): number {
    console.log("se movio")
    return (evt.target as Element).scrollTop;
  }
}