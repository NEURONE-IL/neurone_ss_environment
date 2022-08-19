import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

// Interface to handle the settings of the simulation that is being edited (used to move data between this component and the edit simulation component)
interface simulationSettings {
  name: string
  description: string
  numberStudents: string,
  domain: string,
  task: string,
  numberDocuments: string,
  numberRelevantDocuments: string,
  randomActions: boolean | null,
  expiration: boolean | null,
  behaviorModelId: string,
  length: string,
  sensibility: string,
  interval: string,
  speed: number
}

@Component({
  selector: 'app-simulation-editquerylist',
  templateUrl: './simulation-editquerylist.component.html',
  styleUrls: ['./simulation-editquerylist.component.css']
})

// Component to edit the query list of an existing simulation that is being edited
export class SimulationEditQueryListComponent implements OnInit {

  public queryForm: FormGroup;
  private initialQueryList: string[] = [];
  public queryList: string[] = [];
  public forceDisableSubmitButton: boolean = false;
  private simulationSettings: simulationSettings;
  public simulationInitialName: string = '';
  private _id: string = '';

  @ViewChild('queryListRef') queryListRef!: ElementRef;

  // Constructor: Injects dependencies, initializes the query form, and retrieves the data of the simulation being edited
  constructor(private fb: FormBuilder,
              private router: Router,
              private _renderer2: Renderer2) {
    this.queryForm = this.fb.group({
      query: ['', [Validators.required, this.existingQueryValidator()]]
    });

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this.queryList = Object.assign([], this.router.getCurrentNavigation()?.extras.state!['queryList']);
      this.initialQueryList = Object.assign([], this.queryList);
      
      this.simulationSettings = {
        name: this.router.getCurrentNavigation()?.extras.state!['name'],
        description: this.router.getCurrentNavigation()?.extras.state!['description'],
        numberStudents: this.router.getCurrentNavigation()?.extras.state!['numberStudents'],
        domain: this.router.getCurrentNavigation()?.extras.state!['domain'],
        task: this.router.getCurrentNavigation()?.extras.state!['task'],
        numberDocuments: this.router.getCurrentNavigation()?.extras.state!['numberDocuments'],
        numberRelevantDocuments: this.router.getCurrentNavigation()?.extras.state!['numberRelevantDocuments'],
        randomActions: this.router.getCurrentNavigation()?.extras.state!['randomActions'],
        expiration: this.router.getCurrentNavigation()?.extras.state!['expiration'],
        behaviorModelId: this.router.getCurrentNavigation()?.extras.state!['behaviorModelId'],
        length: this.router.getCurrentNavigation()?.extras.state!['length'],
        sensibility: this.router.getCurrentNavigation()?.extras.state!['sensibility'],
        interval: this.router.getCurrentNavigation()?.extras.state!['interval'],
        speed: this.router.getCurrentNavigation()?.extras.state!['speed'],
      }
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
      this.simulationInitialName = this.router.getCurrentNavigation()?.extras.state!['simulationInitialName'];
      return;
    } else {
      this.router.navigate(['/', 'home']);
    }

    this.simulationSettings = {
      name: '',
      description: '',
      numberStudents: '',
      domain: '',
      task: '',
      numberDocuments: '',
      numberRelevantDocuments: '',
      randomActions: null,
      expiration: null,
      behaviorModelId: '',
      length: '',
      sensibility: '',
      interval: '',
      speed: 1
    }
  }

  ngOnInit(): void {
  }

  // Adds a query to the query list
  public addQuery = (input: string) => {
    this.queryList.push(this.queryForm.get('query')?.value);
    this.queryForm.controls['query'].setValue('');
    this.queryForm.controls['query'].setErrors(null);
    this.forceDisableSubmitButton = true;
    setTimeout(() => {
      this._renderer2.setProperty(this.queryListRef.nativeElement.children[0], 'scrollTop', this.queryListRef.nativeElement.children[0].scrollHeight);
    });
  }

  // Enables the submit query button when the query input field is modified
  public onInputChange = () => {
    this.forceDisableSubmitButton = false;
  }

  // Checks if a query that the user is trying to add already exists
  private existingQueryValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {

      let value = control.value.trim();

      if (!value) {
          return null;
      }

      let queryDoesntExist = true;

      for (let i = 0; i < this.queryList.length; i++) {
        if (this.queryList[i].toLowerCase() === value.toLowerCase()) {
          queryDoesntExist = false;
          break;
        }
      }

      const forbidden = !queryDoesntExist;

      return forbidden ? {queryExists: {value: value}} : null;
      
    };
  }

  // Clears the text of the query input field
  public clearTextInput = (input: string) => {
    this.queryForm.get('query')?.patchValue('');
  }

  // Clears the complete query list
  public clearQueryList = () => {
    this.queryList = [];
  }

  // Deletes a single query
  public deleteQuery(query: string) {
    for (let i = 0; i < this.queryList.length; i++) {

      if (this.queryList[i] == query) {
        this.queryList.splice(i, 1);
        break;
      }

    } 
  }

  // Saves the query list and goes back to the edit simulation component
  public saveQueryList() {
    this.router.navigate(['/', 'simulation-edit'], { state:
      { _id: this._id,
        name: this.simulationSettings.name,
        description: this.simulationSettings.description,
        numberStudents: this.simulationSettings.numberStudents,
        domain: this.simulationSettings.domain,
        task: this.simulationSettings.task,
        numberDocuments: this.simulationSettings.numberDocuments,
        numberRelevantDocuments: this.simulationSettings.numberRelevantDocuments,
        randomActions: this.simulationSettings.randomActions,
        expiration: this.simulationSettings.expiration,
        queryList: this.queryList,
        behaviorModelId: this.simulationSettings.behaviorModelId,
        length: this.simulationSettings.length,
        sensibility: this.simulationSettings.sensibility,
        interval: this.simulationSettings.interval,
        speed: this.simulationSettings.speed,
        queryListAccessed: true,
        simulationInitialName: this.simulationInitialName,
        startEdit: false
     }});
  }

}