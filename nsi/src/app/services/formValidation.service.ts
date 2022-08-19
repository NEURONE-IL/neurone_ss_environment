import { Injectable } from '@angular/core';
import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

// Offers methods to validate text fields in forms
export class FormValidationService {

  // Validation to check if the name of a behavior model node is already in use
  existingNodeNameValidator = (existingNodeNames: string[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim().replace(/_/g, '');
      if (!value) {
          return null;
      }
      let nodeNameDoesntExist = true;
      for (let i = 0; i < existingNodeNames.length; i++) {
        if (existingNodeNames[i].toLowerCase() === value.toLowerCase()) {
          nodeNameDoesntExist = false;
          break;
        }
      }
      const forbidden = !nodeNameDoesntExist;
      return forbidden ? {nodeNameExists: {value: value}} : null;   
    };
  }

  // Validation to check if the name of a simulation or behavior model is already in use
  existingNameValidator = (existingNames: string[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim();
      if (!value) {
          return null;
      }
      let nameDoesntExist = true;
      for (let i = 0; i < existingNames.length; i++) {
        if (existingNames[i].toLowerCase() === value.toLowerCase()) {
          nameDoesntExist = false;
          break;
        }
      }
      const forbidden = !nameDoesntExist;
      return forbidden ? {nameExists: {value: value}} : null;
    };
  }

  // Validation to check if the input is a number
  numberValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
          return null;
      }
      const isNumber = /^-?[0-9]\d*(\.\d+)?$/.test(value);
      const forbidden = !isNumber;
      return forbidden ? {notNumber: {value: value}} : null;
    };
  }

  // Validation to check if the input is an integer number
  integerNumberValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
          return null;
      }
      const isInteger = /^-?[0-9]\d*(\d+)?$/.test(value);
      const forbidden = !isInteger;
      return forbidden ? {notInteger: {value: value}} : null;
    };
  }

  // Validation to check if the maximum transition time is greater than or equal to the minimum transition time
  moreThanMinTransitionTimeValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!/^[0-9]*[1-9][0-9]*$/.test(control.parent?.get('minTransitionTime')?.value)) {
        return null;
      }
      else {
        const value = parseInt(control.value);
        if (!value) {
            return null;
        }
        const minTransitionTime = control.parent?.get('minTransitionTime')?.value;
        let moreThanMinTransitionTime = true;
        if (/^\d+$/.test(minTransitionTime)) {
          if (parseInt(minTransitionTime, 10) >= 1) {
            moreThanMinTransitionTime = (value >= parseInt(minTransitionTime, 10));
          }
        }
        const forbidden = !moreThanMinTransitionTime;
        return forbidden ? {moreThanMinTransitionTime: {value: value}} : null;
      }
    };
  }

  // Validation to check if the number of relevant documents is less than or equal to the number of documents
  lessThanNumberDocumentsValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!/^[0-9]*[1-9][0-9]*$/.test(control.parent?.get('numberDocuments')?.value)) {
        return null;
      }
      else {
        const value = parseInt(control.value);
        if (!value) {
            return null;
        }
        const numberDocuments = control.parent?.get('numberDocuments')?.value;
        const lessThanNumberDocuments = (value <= numberDocuments);
        const forbidden = !lessThanNumberDocuments;
        return forbidden ? {lessThanNumberDocuments: {value: value}} : null;
      }
    };
  }

  // Validation to check if the input text only contains letters, numbers and spaces
  invalidCharactersValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim();
      if (!value) {
          return null;
      }
      const validCharacters = /^[a-zA-Z0-9ñÑ ]+$/.test(value);
      const forbidden = !validCharacters;
      return forbidden ? {invalidCharacters: {value: value}} : null;
    };
  }

}