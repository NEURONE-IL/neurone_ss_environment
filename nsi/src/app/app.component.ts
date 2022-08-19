import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SimulationModalConfirmDeployLeaveComponent } from './components/simulation-modal-confirmdeployleave/simulation-modal-confirmdeployleave.component';
import { SimulationDeployActiveService } from './services/simulationDeployActive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private _router: Router,
              private _matDialog: MatDialog,
              private _simulationDeployActiveService: SimulationDeployActiveService) {
  }

  displayModal() {
    let simulationDeployActive = this._simulationDeployActiveService.getDeployActiveStatus();
    if (simulationDeployActive == true) {
      const dialogRef = this._matDialog.open(SimulationModalConfirmDeployLeaveComponent, { width: '45%', disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this._router.navigate(['/', 'home']);
      }, (error: any) => {
        console.log(error);
      })

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this._router.navigate(['/', 'home']);
    }
  }

}