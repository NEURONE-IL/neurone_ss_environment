import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.css']
})

export class QueryListComponent implements OnInit {

  public queryForm: FormGroup;
  public queryList: string[] = [];

  constructor(private fb: FormBuilder) {

    this.queryForm = this.fb.group({
      query: ['', [Validators.required, this.existingQueryValidator()]]
    });

  }

  ngOnInit(): void {
  }

  public addQuery = (input: string) => {

    this.queryList.push(this.queryForm.get('query')?.value);
    this.queryForm.reset();

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

    this.queryForm.reset();

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

    // GUARDAR LISTA DE QUERIES PARA LA SIMULACIÓN

  }

}
