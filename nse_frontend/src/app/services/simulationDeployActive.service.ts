import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Offers methods to share and update information about whether a simulation deploy is active and visible (the user remains on the simulation deploy view)
export class SimulationDeployActiveService {

  private deployActive: boolean = true;

  // Gets the current component variable
  getDeployActiveStatus(): boolean {
    return this.deployActive;
  }

  // Sets the current component variable
  setDeployActive(): void {
    this.deployActive = true;
  }

  // Sets the current component variable
  setDeployInactive(): void {
    this.deployActive = false;
  }
  
}