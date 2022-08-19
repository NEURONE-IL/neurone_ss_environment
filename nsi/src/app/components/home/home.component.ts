import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimulationDeployActiveService } from '../../services/simulationDeployActive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  public selectedTab: number = 0;

  // Constructor: Switches to the behavior models tab if the user is returning from a component related to behavior models
  constructor(private _router: Router,
              private _simulationDeployActiveService: SimulationDeployActiveService) {
    this._simulationDeployActiveService.setDeployInactive();
    if (this._router.getCurrentNavigation()?.extras.state! !== undefined) {
      let goToBehaviorModelsTab: boolean = false;
      goToBehaviorModelsTab = this._router.getCurrentNavigation()?.extras.state!['goToBehaviorModelsTab'];
      if (goToBehaviorModelsTab === true) {
        this.selectedTab = 1;
      }
    }
  }

  ngOnInit(): void {
  }

}