import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { fromEvent } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';
import { FormValidationService } from '../../services/formValidation.service';
import { EditorMainSettingsService } from '../../services/JointJS/editorMainSettings.service';
import { CatchNotFoundErrorService } from '../../services/catchNotFoundError.service';

import { BehaviorModelModalProbSettingsComponent } from '../behaviormodel-modal-probsettings/behaviormodel-modal-probsettings.component';
import { BehaviorModelModalNodeSettingsBUEComponent } from '../behaviormodel-modal-nodesettingsbue/behaviormodel-modal-nodesettingsbue.component';
import { BehaviorModelModalNodeSettingsPSComponent } from '../behaviormodel-modal-nodesettingsps/behaviormodel-modal-nodesettingsps.component';
import { BehaviorModelModalNodeSettingsQComponent } from '../behaviormodel-modal-nodesettingsq/behaviormodel-modal-nodesettingsq.component';
import { BehaviorModelModalEditedComponent } from '../behaviormodel-modal-edited/behaviormodel-modal-edited.component';
import { BehaviorModelModalHasErrorsComponent } from '../behaviormodel-modal-haserrors/behaviormodel-modal-haserrors.component';

import { addStartNode } from '../../services/JointJS/addNodes/addStartNode';
import { addQueryNode } from '../../services/JointJS/addNodes/addQueryNode';
import { addSERPNode } from '../../services/JointJS/addNodes/addSERPNode';
import { addPageNode } from '../../services/JointJS/addNodes/addPageNode';
import { addBookmarkNode } from '../../services/JointJS/addNodes/addBookmarkNode';
import { addUnbookmarkNode } from '../../services/JointJS/addNodes/addUnbookmarkNode';
import { addEndNode } from '../../services/JointJS/addNodes/addEndNode';
import { convertToJSON } from '../../services/JointJS/convertToJSON/convertToJSON';
import { validateModel } from '../../services/JointJS/validateModel/validateModel';

// Interface to handle the coordinates of the section of the diagram that is currently visible in the editor - The origin (0,0) is on the top left corner of the diagram
interface visiblePaper {
  x: number,
  y: number
}

@Component({
  selector: 'app-behaviormodel-edit',
  templateUrl: './behaviormodel-edit.component.html',
  styleUrls: ['./behaviormodel-edit.component.css']
})

// Behavior model edit view
export class BehaviorModelEditComponent implements OnInit {

  private graph: joint.dia.Graph
  private paper: joint.dia.Paper
  public paperScale: number
  public paperScaleString: string
  private queryCount: number
  private SERPCount: number
  private pageCount: number
  private bookmarkCount: number
  private unbookmarkCount: number
  private endCount: number
  private lastSelectedCell: string
  public editorWidth: number
  public editorHeight: number
  private editorPadding: number
  private modelWidth: number
  private modelHeight: number
  private scrollTop: number
  private scrollLeft: number
  private visiblePaper: visiblePaper
  public behaviorModelForm: FormGroup
  private behaviorModelExistingNames: string[] = []
  public modelValid = false;
  public errorMessages: string[] = [];
  public loading: boolean

  private _id: string = '';
  public behaviorModelInitialName: string = '';
  private creationDate: string = '';
  private fullModel: string = '';

  @ViewChild('behaviorModelContainer') behaviorModelContainer!: ElementRef;

  // Constructor: Initializes the settings of this instance of the behavior model editor, and retrieves the data of the specific model to edit
  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              public snackbar: MatSnackBar,
              private elementRef: ElementRef,
              private _behaviorModelService: BehaviorModelService,
              private router: Router,
              private _formValidationService: FormValidationService,
              private _editorMainSettingsService: EditorMainSettingsService,
              private _catchNotFoundErrorService: CatchNotFoundErrorService) {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({model: this.graph});
    this.paperScale = 1;
    this.paperScaleString = "100";
    this.queryCount = 0;
    this.SERPCount = 0;
    this.pageCount = 0;
    this.bookmarkCount = 0;
    this.unbookmarkCount = 0;
    this.endCount = 0;
    this.lastSelectedCell = '';
    this.editorWidth = EditorMainSettingsService.editorWidth;
    this.editorHeight = EditorMainSettingsService.editorHeight;
    this.editorPadding = EditorMainSettingsService.editorPadding;
    this.modelWidth = EditorMainSettingsService.editorWidth;    // Temporary value, so that the compiler will not complain that this property is not definitely assigned in the constructor
    this.modelHeight = EditorMainSettingsService.editorHeight;  // Temporary value, so that the compiler will not complain that this property is not definitely assigned in the constructor
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.visiblePaper = {x: 0, y: 0}
    this.loading = true;

    this.behaviorModelForm = this.fb.group({
      name: ['', [Validators.required, this.existingModelNameValidator(this.behaviorModelExistingNames), this.invalidCharactersValidator()]]
    });

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
      this._behaviorModelService.getBehaviorModel(this._id).subscribe((data: BehaviorModel) => {
        this.behaviorModelForm = this.fb.group({
          name: [data.name, [Validators.required, this.existingModelNameValidator(this.behaviorModelExistingNames), this.invalidCharactersValidator()]]
        });

        this.behaviorModelInitialName = data.name;
        this.creationDate = data.creationDate;
        this.fullModel = data.fullModel;
        this.modelValid = data.valid;
        this.modelWidth = data.modelWidth;
        this.modelHeight = data.modelHeight;

        return;
      }, (error: any) => {
        this._catchNotFoundErrorService.catchBehaviorModelNotFoundError(error);
      })
    } else {
      this.router.navigate(['/', 'home']);
    }
  }

  // ngOnInit: Retrieves the names of the existing behavior models for form validation, initializes the graph and the paper with their respective events, and runs the model validation method
  async ngOnInit() {
    // Retrieving the names of all existing behavior models for form validation
    let behaviorModelList = await this._behaviorModelService.getBehaviorModelsProperties().toPromise();
    for (let i = 0; i < behaviorModelList.length; i++) {
      this.behaviorModelExistingNames.push(behaviorModelList[i].name);
    }
    this.behaviorModelExistingNames.splice(this.behaviorModelExistingNames.indexOf(this.behaviorModelInitialName), 1);
    
    // Initializing the graph
    var namespace = joint.shapes;
    this.graph = new joint.dia.Graph({}, { cellNamespace: namespace });
    this.graph.fromJSON(JSON.parse(this.fullModel));

    // Initializing the paper for the behavior model editor, with its basic settings
    this.paper = this._editorMainSettingsService.initializePaper(this.graph, this.modelWidth, this.modelHeight, namespace);

    // Restoring the element tools (including a delete button) to each existing node - The element tools are displayed when clicking on a node
    this.graph = this._editorMainSettingsService.restoreElementToolsForEdit(this.graph, this.paper)

    // Initializing the graph events of the diagram
    this.initializeGraphEvents();

    // Initializing the paper events of the diagram
    this.initializePaperEvents();

    // If the behavior model is not valid (has errors), the model validation method is run in order to display the current list of errors to the user
    if (this.modelValid == false) {
      this.errorMessages = validateModel(this.graph);
    }

    this.loading = false;
  }

  // Initializes all events related to the graph
  private initializeGraphEvents = () => {

    // When the user drags a node, the dimensions of the diagram are automatically adjusted to account for the position of the nodes
    this.graph.on('change:position', (evt: any) => {
      if (evt.attributes.position.x < 0) {
        evt.attributes.position.x = 0;
      }
      if (evt.attributes.position.y < 0) {
        evt.attributes.position.y = 0;
      }

      if (this.paperScale < 1) {
        this.paper.fitToContent({
          minWidth: this.modelWidth,
          minHeight: this.modelHeight,
          padding: this.editorPadding
        });
      } else {
        this.paper.fitToContent({
          minWidth: this.editorWidth * this.paperScale,
          minHeight: this.editorHeight * this.paperScale,
          padding: this.editorPadding * this.paperScale
        });
      };
    });

    // When the user removes a link that begins on a specific node, the colors of the likelihood (probability) text on all other links beginning on the same node are updated
    // Also, when the user removes an object in the diagram, the diagram's width and height are recalculated
    this.graph.on('remove', (cell: any) => {
      if (cell.isLink()) {
        let sourceId = cell.get('source').id;
        this.updateProbabilityColors(sourceId);
      }

      if (this.paperScale < 1) {
        this.paper.fitToContent({
          minWidth: this.modelWidth,
          minHeight: this.modelHeight,
          padding: this.editorPadding
        });
      } else {
        this.paper.fitToContent({
          minWidth: this.editorWidth * this.paperScale,
          minHeight: this.editorHeight * this.paperScale,
          padding: this.editorPadding * this.paperScale
        });
      };
    });

  }

  // Initializes all events related to the paper
  private initializePaperEvents = () => {

    // When the user double-clicks a node, the node settings modal component is displayed
    this.paper.on('element:pointerdblclick', (elementView: any) => {
      this.openNodeSettingsModal(elementView);
    });

    // When the user double-clicks a link, the likelihood (probability) settings modal component is displayed
    this.paper.on('link:pointerdblclick', (linkView: any) => {
      this.openProbabilityModal(linkView);
    });

    // When the user clicks a node, the node element tools are displayed - The element tools include a delete button to delete the node
    this.paper.on('cell:pointerclick cell:pointerdown', (elementView: any) => {
        this.paper.hideTools();
        elementView.showTools();
        this.lastSelectedCell = elementView.id;
    });

    // When the user clicks a blank area of the diagram, all node element tools currently on display are hidden
    this.paper.on('blank:pointerclick', () => {
        this.paper.hideTools();
    });

    // When the user connects a link to another object in the diagram, the connection is validated, and if it isn't valid, it is deleted
    this.paper.on('link:connect', (linkView: any) => {

      let link = linkView.model;
      if (link.get('source').id && link.get('target').id) {

        // Only allowing links to ports in a node

        if (link.get('target').port === undefined) {
          this.graph.getCell(link.id).remove();
          return;
        }

        // Getting the source and target nodes of a link (the nodes where the link begins and ends)

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

        // Checking if there are any loops in the diagram, before deleting them

        let elements = this.graph.getElements();
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].id === sourceId) {
            let sourceElement = elements[i];
            let predecessors = this.graph.getPredecessors(sourceElement, { deep: true });
            let successors = this.graph.getSuccessors(sourceElement, { deep: true});
            let commonElements = _.intersection(predecessors, successors);
            if (!_.isEmpty(commonElements)) {
              this.graph.getCell(link.id).remove();
              this.snackbar.open('Loops between nodes are not allowed', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
              return;
            }
          }
        }

        // Automatically assigning a 100% likelihood (probability) to the link between the start node and a query node

        if (sourceTypeNode === "start") {
          link.label(0, { attrs: { text: { text: "100%", fill: "black" } } });
        }

        // Prevents double links (in the same direction) between one node and another

        for (let i = 0; i < diagram.cells.length; i++) {
          if (diagram.cells[i].type == "link") {
            if ((diagram.cells[i].source.id === sourceId)
             && (diagram.cells[i].target.id === targetId)
             && (diagram.cells[i].id !== link.id)) {
              this.graph.getCell(link.id).remove();
              this.snackbar.open('Link already exists', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
              return;
            }
          }
        }

        // Preventing nodes of certain types from being linked to more than one node of another type (check the snackbar messages for more information)

        for (let i = 0; i < diagram.cells.length; i++) {
          if ((diagram.cells[i].type == "link") && (diagram.cells[i].id !== link.id)) {
            let targetType = '';
            for (let j = 0; j < diagram.cells.length; j++) {
              if (diagram.cells[j].id == diagram.cells[i].target.id) {
                targetType = diagram.cells[j].typeNode;
              }
            }
            if (targetTypeNode === "end") {
              if ((diagram.cells[i].source.id === sourceId) && (targetType === "end")) {
                this.graph.getCell(link.id).remove();
                this.snackbar.open('A node must be linked to only one end node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                return;
              }
            }
          }
        }

        if (sourceTypeNode == "start") {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type == "link") && (diagram.cells[i].id !== link.id)) {
              if (diagram.cells[i].source.id === sourceId) {
                this.graph.getCell(link.id).remove();
                this.snackbar.open('A start node must be linked to only one node, and it must be a query node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                return;
              }
            }
          }
        }

        else if (sourceTypeNode == "query") {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type == "link") && (diagram.cells[i].id !== link.id)) {
              let targetType = '';
              for (let j = 0; j < diagram.cells.length; j++) {
                if (diagram.cells[j].id == diagram.cells[i].target.id) {
                  targetType = diagram.cells[j].typeNode;
                }
              }
              if (targetTypeNode === "page") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "page")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A query node must be linked to only one page/SERP node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
              else if (targetTypeNode === "query") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "query")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A query node must be linked to only one query node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
            }
          }
        }

        else if (sourceTypeNode == "page") {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type == "link") && (diagram.cells[i].id !== link.id)) {
              let targetType = '';
              for (let j = 0; j < diagram.cells.length; j++) {
                if (diagram.cells[j].id == diagram.cells[i].target.id) {
                  targetType = diagram.cells[j].typeNode;
                }
              }
              if (targetTypeNode === "bookmark") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "bookmark")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A page/SERP node must be linked to only one bookmark node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
              else if (targetTypeNode === "unbookmark") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "unbookmark")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A page/SERP node must be linked to only one unbookmark node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
              else if (targetTypeNode === "page") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "page")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A page/SERP node must be linked to only one page/SERP node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
              else if (targetTypeNode === "query") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "query")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A page/SERP node must be linked to only one query node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
            }
          }
        }

        else if (sourceTypeNode == "bookmark") {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type == "link") && (diagram.cells[i].id !== link.id)) {
              let targetType = '';
              for (let j = 0; j < diagram.cells.length; j++) {
                if (diagram.cells[j].id == diagram.cells[i].target.id) {
                  targetType = diagram.cells[j].typeNode;
                }
              }
              if (targetTypeNode === "page") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "page")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A bookmark node must be linked to only one page/SERP node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
              else if (targetTypeNode === "query") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "query")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A bookmark node must be linked to only one query node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
            }
          }
        }

        else if (sourceTypeNode == "unbookmark") {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type == "link") && (diagram.cells[i].id !== link.id)) {
              let targetType = '';
              for (let j = 0; j < diagram.cells.length; j++) {
                if (diagram.cells[j].id == diagram.cells[i].target.id) {
                  targetType = diagram.cells[j].typeNode;
                }
              }
              if (targetTypeNode === "page") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "page")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('An unbookmark node must be linked to only one page/SERP node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
              else if (targetTypeNode === "query") {
                if ((diagram.cells[i].source.id === sourceId) && (targetType === "query")) {
                  this.graph.getCell(link.id).remove();
                  this.snackbar.open('A unbookmark node must be linked to only one query node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                  return;
                }
              }
            }
          }
        }

        // Preventing nodes of certain types from being linked more than once to a specific node of another type (check the snackbar messages for more information)

        if ((sourceTypeNode === "page") && (targetTypeNode === "page")) {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type === "link") && (diagram.cells[i].id !== link.id)) {
              if (diagram.cells[i].target.id === targetId) {

                for (let j = 0; j < diagram.cells.length; j++) {
                  if ((diagram.cells[j].type !== "link") && (diagram.cells[j].id === diagram.cells[i].source.id)) {
                    if (diagram.cells[j].typeNode === "page") {
                      this.graph.getCell(link.id).remove();
                      this.snackbar.open('Two page/SERP nodes cannot lead to the same page/SERP node.', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                      return;
                    }
                  }
                }

              }
            }
          }
        }

        if ((sourceTypeNode === "query") && (targetTypeNode === "page")) {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type === "link") && (diagram.cells[i].id !== link.id)) {
              if (diagram.cells[i].target.id === targetId) {

                for (let j = 0; j < diagram.cells.length; j++) {
                  if ((diagram.cells[j].type !== "link") && (diagram.cells[j].id === diagram.cells[i].source.id)) {
                    if (diagram.cells[j].typeNode === "query") {
                      this.graph.getCell(link.id).remove();
                      this.snackbar.open('Two query nodes cannot lead to the same page/SERP node.', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                      return;
                    }
                  }
                }

              }
            }
          }
        }

        if ((sourceTypeNode === "page") && (targetTypeNode === "bookmark")) {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type === "link") && (diagram.cells[i].id !== link.id)) {
              if (diagram.cells[i].target.id === targetId) {

                for (let j = 0; j < diagram.cells.length; j++) {
                  if ((diagram.cells[j].type !== "link") && (diagram.cells[j].id === diagram.cells[i].source.id)) {
                    if (diagram.cells[j].typeNode === "page") {
                      this.graph.getCell(link.id).remove();
                      this.snackbar.open('Two page/SERP nodes cannot lead to the same bookmark node.', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                      return;
                    }
                  }
                }

              }
            }
          }
        }

        if ((sourceTypeNode === "page") && (targetTypeNode === "unbookmark")) {
          for (let i = 0; i < diagram.cells.length; i++) {
            if ((diagram.cells[i].type === "link") && (diagram.cells[i].id !== link.id)) {
              if (diagram.cells[i].target.id === targetId) {

                for (let j = 0; j < diagram.cells.length; j++) {
                  if ((diagram.cells[j].type !== "link") && (diagram.cells[j].id === diagram.cells[i].source.id)) {
                    if (diagram.cells[j].typeNode === "page") {
                      this.graph.getCell(link.id).remove();
                      this.snackbar.open('Two page/SERP nodes cannot lead to the same unbookmark node.', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
                      return;
                    }
                  }
                }

              }
            }
          }
        }

        // Preventing nodes from being linked to themselves

        if (sourceId == targetId) {
          this.graph.getCell(link.id).remove();
          this.snackbar.open('Invalid link', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
          return;
        }

        // Preventing invalid links, depending on the types of nodes being linked

        if (sourceTypeNode == "start") {
          if (targetTypeNode != "query") {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('A start node must be linked to only one node, and it must be a query node', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
            return;
          }

        } else if (sourceTypeNode == "query") {       
          if ((targetTypeNode != "query") && (targetTypeNode != "page") && (targetTypeNode != "end")) {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
            return;
          }

        } else if (sourceTypeNode == "page") {        
          if ((targetTypeNode != "query") && (targetTypeNode != "page") && (targetTypeNode != "bookmark") && (targetTypeNode != "unbookmark") && (targetTypeNode != "end")) {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
            return;
          }

        } else if (sourceTypeNode == "bookmark") {      
          if ((targetTypeNode != "query") && (targetTypeNode != "page") && (targetTypeNode != "end")) {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
            return;
          }

        } else if (sourceTypeNode == "unbookmark") {    
          if ((targetTypeNode != "query") && (targetTypeNode != "page") && (targetTypeNode != "end")) {
            this.graph.getCell(link.id).remove();
            this.snackbar.open('Invalid link', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
            return;
          }

        } else if (sourceTypeNode == "end") {         
          this.graph.getCell(link.id).remove();
          this.snackbar.open('Invalid link', '(close)', {duration: 4000, panelClass: 'snackbar-model-error'});
        }

        // Updating the colors of the likelihood (probability) text in the relevant links, in case a link was deleted

        this.updateProbabilityColors(sourceId);

      } else {

        // If the relevant link currently does not connect two nodes, the colors of the likelihood (probability) text in the links of the diagram are checked and updated as necessary

        if (link.attributes.labels[0].attrs.text.text !== "(no value)") {
          this.graph.getCell(link.id).attr('text/fill', "red");
        }

        let diagram = this.graph.toJSON();

        for (let i = 0; i < diagram.cells.length; i++) {
          if (diagram.cells[i].type !== "link") {
            let sourceId = diagram.cells[i].id;
            this.updateProbabilityColors(sourceId);
          }
        }
      }
    });

  }

  // Adds a query node
  public addQueryAction = () => {
    this.queryCount = addQueryNode({graph: this.graph, paper: this.paper, queryCount: this.queryCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  // Adds a SERP node
  public addSERPAction = () => {
    this.SERPCount = addSERPNode({graph: this.graph, paper: this.paper, SERPCount: this.SERPCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  // Adds a page node
  public addPageAction = () => {
    this.pageCount = addPageNode({graph: this.graph, paper: this.paper, pageCount: this.pageCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  // Adds a bookmark node
  public addBookmarkAction = () => {
    this.bookmarkCount = addBookmarkNode({graph: this.graph, paper: this.paper, bookmarkCount: this.bookmarkCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  // Adds an unbookmark node
  public addUnbookmarkAction = () => {
    this.unbookmarkCount = addUnbookmarkNode({graph: this.graph, paper: this.paper, unbookmarkCount: this.unbookmarkCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  // Adds an end node
  public addEndAction = () => {
    this.endCount = addEndNode({graph: this.graph, paper: this.paper, endCount: this.endCount, visiblePaperX: this.visiblePaper.x, visiblePaperY: this.visiblePaper.y});
  }

  // Open the modal that lets the user edit the likelihood (probability) of a link
  private openProbabilityModal = (linkView: any) => {
    if (linkView.model.attributes.source.id !== undefined) {
      let linkSourceId = linkView.model.attributes.source.id;
      let sourceTypeNode = this.graph.getCell(linkSourceId).attributes['typeNode'];
      if (sourceTypeNode === "start") {
        return;
      }

      var currentProbability = linkView.model.attributes.labels[0].attrs.text.text;
      const dialogRef = this.dialog.open(BehaviorModelModalProbSettingsComponent, { width: '40%', data: { currentProbability: currentProbability }, disableClose: true } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
        linkView.model.label(0, { attrs: { text: { text: value.concat("%") } } });
        this.updateProbabilityColors(linkSourceId);
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      var currentProbability = linkView.model.attributes.labels[0].attrs.text.text;
      const dialogRef = this.dialog.open(BehaviorModelModalProbSettingsComponent, { width: '40%', data: { currentProbability: currentProbability }, disableClose: true } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe((value) => {
        linkView.model.label(0, { attrs: { text: { text: value.concat("%") } } });
        dialogRef.close();
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }
  }

  // Changes the color of the likelihood (probability) text on all the links that begin on a certain node, depending on whether those likelihoods are valid or not
  private updateProbabilityColors(linkSourceId: string) {
    let probabilitiesValid = this.probabilitiesAreValid(linkSourceId);
    if (probabilitiesValid == true) {
      this.changeProbabilityColors(linkSourceId, 'black');
    } else {
      this.changeProbabilityColors(linkSourceId, 'red');
    }
  }

  // Changes the color of the likelihood (probability) text on all the links that begin on a certain node
  private changeProbabilityColors(linkSourceId: string, color: string) {
    let diagram = this.graph.toJSON();

    for (let i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type === "link") {
        if (diagram.cells[i].source.id == linkSourceId) {
          this.graph.getCell(diagram.cells[i]).attributes['labels'][0].attrs.text.fill = color;
          this.graph.getCell(diagram.cells[i]).attr('text/fill', color);
        }
      }
    }
  }

  // Checks if the likelihoods (probabilities) of all links that begin on a certain node are valid
  private probabilitiesAreValid(linkSourceId: string): boolean {
    let diagram = this.graph.toJSON();

    let i: number;
    let nodeIndex: number;
    for (i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].id == linkSourceId) {
        nodeIndex = i;
      }
    }

    let nodeProbabilitySum = 0;
    let nodeOutLinkCount = 0;

    for (i = 0; i < diagram.cells.length; i++) {
      if (diagram.cells[i].type === "link") {
        if (diagram.cells[i].source.id == linkSourceId) {
          let probValue = diagram.cells[i].labels[0].attrs.text.text;
          if (probValue === "(no value)") {
            return false;
          } else {
            nodeOutLinkCount = nodeOutLinkCount + 1;
            nodeProbabilitySum = nodeProbabilitySum + parseInt(probValue);
          }
        }
      }
    }

    if (nodeProbabilitySum != 100 && nodeOutLinkCount > 0) {
      return false;
    } else {
      return true;
    }
  }

  // Open the modal that lets the user edit the settings of a specific node
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

      const dialogRef = this.dialog.open(BehaviorModelModalNodeSettingsPSComponent, { width: '52%', data: { nodeName: nodeName, minTransitionTime: minTransitionTime, maxTransitionTime: maxTransitionTime, relevantPage: relevantPage, existingNodeNames: existingNodeNames }, disableClose: true } );
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
    } else if ((typeNode == "end") || (typeNode == "bookmark") || (typeNode == "unbookmark")) {
      var nodeName = elementView.model.attributes.attrs.label.text;
      var existingNodeNames = this.getNodeNames();

      const dialogRef = this.dialog.open(BehaviorModelModalNodeSettingsBUEComponent, { width: '45%', data: { nodeName: nodeName, existingNodeNames: existingNodeNames }, disableClose: true } );
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

      const dialogRef = this.dialog.open(BehaviorModelModalNodeSettingsQComponent, { width: '52%', data: { nodeName: nodeName, minTransitionTime: minTransitionTime, maxTransitionTime: maxTransitionTime, existingNodeNames: existingNodeNames }, disableClose: true } );
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

  // Gets the names of all the nodes currently present in the diagram (for form validation)
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

  // Saves the changes made to the behavior model
  public editBehaviorModel = async () => {
    this.errorMessages = validateModel(this.graph);
    if (this.errorMessages.length > 0) {
      this.modelValid = false;
    } else {
      this.modelValid = true;
    }

    let simulatorModel = '{}';

    if (this.modelValid == true) {
      simulatorModel = JSON.stringify(convertToJSON(this.graph));
    }

    const BEHAVIORMODEL: BehaviorModel = {
      name: this.behaviorModelForm.get('name')?.value.trim(),
      fullModel: JSON.stringify(this.graph.toJSON()),
      simulatorModel: simulatorModel,
      modelWidth: parseInt(this.paper.options.width!.toString()),
      modelHeight: parseInt(this.paper.options.height!.toString()),
      valid: this.modelValid,
      creationDate: this.creationDate,
      lastModificationDate: (new Date(Date.now())).toString()
    };

    if (this.modelValid == true) {
      try {
        let behaviorModel = await this._behaviorModelService.getBehaviorModel(this._id).toPromise();
      } catch (error: any) {
        this._catchNotFoundErrorService.catchBehaviorModelNotFoundError(error);
        return;
      }

      this._behaviorModelService.updateBehaviorModel(this._id, BEHAVIORMODEL).subscribe(data => {
        this.openSuccessModal();
      }), (error: any) => {
        console.log(error);
        this.router.navigate(['/', 'home']);
      }
    } else {
      const dialogRef = this.dialog.open(BehaviorModelModalHasErrorsComponent, { width: '45%', disableClose: true } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe(async (value: any) => {
        dialogRef.close();
        if (value == true) {
          try {
            let behaviorModel = await this._behaviorModelService.getBehaviorModel(this._id).toPromise();
          } catch (error: any) {
            this._catchNotFoundErrorService.catchBehaviorModelNotFoundError(error);
            return;
          }

          this._behaviorModelService.updateBehaviorModel(this._id, BEHAVIORMODEL).subscribe(data => {
            this.openSuccessModal();
          }), (error: any) => {
            console.log(error);
            this.router.navigate(['/', 'home']);
          }
        }
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }
  }

  // Open the modal that lets the user know that the behavior model has been edited
  private openSuccessModal = () => {
    const dialogRef = this.dialog.open(BehaviorModelModalEditedComponent, { width: '25%', disableClose: true } );
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value: any) => {
      dialogRef.close();
      this.router.navigate(['/', 'behaviormodel-settings'], { state:
        { _id: this._id
       }});
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  // Navigates to the behavior model settings view, discarding any changes made in the behavior model
  public discardModel = async () => {
    try {
      let behaviorModel = await this._behaviorModelService.getBehaviorModel(this._id).toPromise();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchBehaviorModelNotFoundError(error);
      return;
    }

    this.router.navigate(['/', 'behaviormodel-settings'], { state:
      { _id: this._id
    }});
  }

  // Increases the zoom of the diagram
  public zoomInAction = () => {
    var output = this._editorMainSettingsService.zoomIn({paper: this.paper, paperScale: this.paperScale, paperScaleString: this.paperScaleString, modelWidth: this.modelWidth, modelHeight: this.modelHeight});
    this.paper = output.paper;
    this.paperScale = output.paperScale;
    this.paperScaleString = output.paperScaleString;
    this.scrollTop = this.behaviorModelContainer.nativeElement.scrollTop;
    this.scrollLeft = this.behaviorModelContainer.nativeElement.scrollLeft;
    this.visiblePaper.x = Math.round(this.scrollLeft / this.paperScale);
    this.visiblePaper.y = Math.round(this.scrollTop / this.paperScale);
  }

  // Decreases the zoom of the diagram
  public zoomOutAction = () => {
    var output = this._editorMainSettingsService.zoomOut({paper: this.paper, paperScale: this.paperScale, paperScaleString: this.paperScaleString, modelWidth: this.modelWidth, modelHeight: this.modelHeight});
    this.paper = output.paper;
    this.paperScale = output.paperScale;
    this.paperScaleString = output.paperScaleString;
    this.scrollTop = this.behaviorModelContainer.nativeElement.scrollTop;
    this.scrollLeft = this.behaviorModelContainer.nativeElement.scrollLeft;
    this.visiblePaper.x = Math.round(this.scrollLeft / this.paperScale);
    this.visiblePaper.y = Math.round(this.scrollTop / this.paperScale);
  }

  // Restores the default zoom of the diagram (100%)
  public restoreZoomAction = () => {
    var output = this._editorMainSettingsService.restoreZoom({paper: this.paper, paperScale: this.paperScale, paperScaleString: this.paperScaleString, modelWidth: this.modelWidth, modelHeight: this.modelHeight});
    this.paper = output.paper;
    this.paperScale = output.paperScale;
    this.paperScaleString = output.paperScaleString;
    this.scrollTop = this.behaviorModelContainer.nativeElement.scrollTop;
    this.scrollLeft = this.behaviorModelContainer.nativeElement.scrollLeft;
    this.visiblePaper.x = Math.round(this.scrollLeft / this.paperScale);
    this.visiblePaper.y = Math.round(this.scrollTop / this.paperScale);
  }

  // Event that is triggered when the diagram scroll position changes, and which causes the visible paper coordinates to be updated
  public onScroll(event: Event): void {
    const element = (event.target as HTMLDivElement);
    this.scrollTop = element.scrollTop;
    this.scrollLeft = element.scrollLeft;
    this.visiblePaper.x = Math.round(this.scrollLeft / this.paperScale);
    this.visiblePaper.y = Math.round(this.scrollTop / this.paperScale);
  }

  // Validation to check if the name of a behavior model is already in use
  private existingModelNameValidator = (behaviorModelExistingNames: string[]): ValidatorFn => {
    return this._formValidationService.existingNameValidator(behaviorModelExistingNames);
  }

  // Validation to check if the input text only contains letters, numbers and spaces
  private invalidCharactersValidator = (): ValidatorFn => {
    return this._formValidationService.invalidCharactersValidator();
  }

  // Clears a text input field in a form
  public clearTextInput = (input: string) => {
    this.behaviorModelForm.patchValue({[input]: ''});
  }

}