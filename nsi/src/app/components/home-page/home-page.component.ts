import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  public selectedTab: number = 0;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      let goToBehaviorModelsTab: boolean = false;
      goToBehaviorModelsTab = this.router.getCurrentNavigation()?.extras.state!['goToBehaviorModelsTab'];
      if (goToBehaviorModelsTab === true) {
        this.selectedTab = 1;
      }
    }
  }

  ngOnInit(): void {
  }

}