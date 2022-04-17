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

  ngOnInit(): void {
    var namespace = joint.shapes;

    var graph = new joint.dia.Graph({}, { cellNamespace: namespace });

    var paper = new joint.dia.Paper({
        el: jQuery('#modelEditor'),
        model: graph,
        width: 1000,
        height: 300,
        gridSize: 1,
        cellViewNamespace: namespace
    });

    var link = new joint.shapes.standard.Link();
    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
        body: {
            fill: 'lightgrey'
        },
        label: {
            text: 'P',
            fill: 'black'
        },
        text: { text: 'Parent', 'ref-y': 40, magnet: true}
    });
    rect.addTo(graph);
  }

  ngAfterViewInit() {

  }

}
