
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

    //@HostListener('document:keyup', ['$event'])
    //handleDeleteKeyboardEvent(event: KeyboardEvent) {
    //  if (event.key === 'Delete') {
    //    console.log("DELIT");
    //
    //  }