import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-simulation-query-list',
  templateUrl: './edit-simulation-query-list.component.html',
  styleUrls: ['./edit-simulation-query-list.component.css']
})

export class EditSimulationQueryListComponent implements OnInit {

  public queryForm: FormGroup;
  private initialQueryList: string[] = [];
  public queryList: string[] = [];
  public forceDisableSubmitButton: boolean = false;
  private simulationSettings: simulationSettings;
  public simulationInitialName: string = '';
  private _id: string = '';

  @ViewChild('queryListRef') queryListRef!: ElementRef;

  constructor(private fb: FormBuilder, private router: Router, private _renderer2: Renderer2) {

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

  public addQuery = (input: string) => {

    this.queryList.push(this.queryForm.get('query')?.value);
    this.queryForm.controls['query'].setValue('');
    this.queryForm.controls['query'].setErrors(null);
    this.forceDisableSubmitButton = true;
    setTimeout(() => {
      this._renderer2.setProperty(this.queryListRef.nativeElement.children[0], 'scrollTop', this.queryListRef.nativeElement.children[0].scrollHeight);
    });

  }

  public onInputChange = () => {

    this.forceDisableSubmitButton = false;

  }

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

  public clearTextInput = (input: string) => {

    this.queryForm.get('query')?.patchValue('');

  }

  public clearQueryList = () => {

    this.queryList = [];

  }

  public deleteQuery(query: string) {

    for (let i = 0; i < this.queryList.length; i++) {

      if (this.queryList[i] == query) {
        this.queryList.splice(i, 1);
        break;
      }

    } 

  }

  public saveQueryList() {

    this.router.navigate(['/', 'edit-simulation'], { state:
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

  public discardQueryList() {

    this.router.navigate(['/', 'edit-simulation'], { state:
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
        queryList: this.initialQueryList,
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