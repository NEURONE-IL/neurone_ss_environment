import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

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

  constructor() {    
    this.pageCount = 0;
    this.queryCount = 0;
    this.bookmarkCount = 0;
    this.unBookmarkCount = 0;
    this.endCount = 0;
  }

  ngOnInit(): void {
    var namespace = joint.shapes;

    this.graph = new joint.dia.Graph({}, { cellNamespace: namespace });
    this.pageCount = 0;

    var paper = new joint.dia.Paper({
        el: jQuery('#modelEditor'),
        model: this.graph,
        width: 1000,
        height: 400,
        gridSize: 1,
        cellViewNamespace: namespace,
        perpendicularLinks: true,
        linkPinning: false,
        defaultLink: new joint.dia.Link({
          router: { name: 'manhattan' },
          connection: { name: 'rounded' },
          attrs: {
            '.connection': {
              'stroke-width': 2
            }
          }
        })
    });

    paper.on('cell:pointerclick', function(elementView) {
      var currentElement = elementView.model;
      //currentElement.attributes['ports'].groups.bottomPorts.attrs.portBody.fill = 'blue';
      currentElement.attr('[port="topPort1"]/fill', 'blue');
      console.log(currentElement);
    });
  }

  ngAfterViewInit() {
  }

/*  COSAS POR HACER:
AGREGAR LOS DEMAS BOTONES DE CREACION DE NODOS
PONER ICONOS EN BOTONES DE AGREGAR NODOS
PODER BORRAR NODOS
QUITAR CREACION DE CODOS DE FLECHAS, SIMPLIFICAR FLECHAS (SIN ESQUINAS DE COLORES)
QUE LAS FLECHAS A CREAR TENGAN COMO DESTINO SOLO LOS PUERTOS, NO EL CUERPO DEL ELEMENTO
QUE LOS PUERTOS DE UN NODO SE VEAN AL SELECCIONARLO, Y SE OCULTEN AL SELECCIONAR CUALQUIER OTRA COSA
QUE LOS PUERTOS NO SE LINKEEN CONSIGO MISMOS
BOTON EN FLECHA PARA AGREGAR TEXTO A FLECHA
DIAGRAMA SCROLLABLE
AL SELECCIONAR NODO, TIENE QUE PONERSE ENCIMA DE LOS DEMÁS
FLECHAS CON UN SOLO SENTIDO
*/
  addPageNode(): void {

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
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort3' }}
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

  }

  addQueryNode(): void {

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
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort3' }}
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

  }

  addBookmarkNode(): void {

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

  }

  addUnBookmarkNode(): void {

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

  }

  addEndNode(): void {

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
            group: 'bottomPorts',
            attrs: { label: { text: 'bottomPort3' }}
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

  }

}

//     function convertToJSON() {
//         const JSONTextItem = document.getElementById('JSONtext');
//         JSONTextItem.innerHTML = "";
//         JSONTextItem.insertAdjacentText('beforeend', JSON.stringify(graph.toJSON()));
//     }
// </script>
