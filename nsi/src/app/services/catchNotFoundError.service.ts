import { Injectable } from '@angular/core';
import { SimulationModalSimNotFoundComponent } from '../components/simulation-modal-simnotfound/simulation-modal-simnotfound.component';
import { BehaviorModelModalNotFoundComponent } from '../components/behaviormodel-modal-notfound/behaviormodel-modal-notfound.component';
import { ModalErrorComponent } from '../components/modal-error/modal-error.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

// Offers methods to handle the catch blocks of missing simulation and missing behavior model errors, by displaying the respective modal components
export class CatchNotFoundErrorService {

  // Constructor: Injects dependencies
  constructor(public dialog: MatDialog,
              private router: Router,) {
  }

  // Handles the catch block of a missing simulation error, by displaying the respective modal components
  catchSimulationNotFoundError = (error: any) => {
    if (error.status == 404) {
      const dialogRef = this.dialog.open(SimulationModalSimNotFoundComponent, { width: '30%', disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.router.navigate(['/', 'home']);
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      const dialogRef = this.dialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.router.navigate(['/', 'home']);
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }
  }

  // Handles the catch block of a missing behavior model error, by displaying the respective modal components
  catchBehaviorModelNotFoundError = (error: any) => {
    if (error.status == 404) {
      const dialogRef = this.dialog.open(BehaviorModelModalNotFoundComponent, { width: '30%', disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.router.navigate(['/', 'home'], { state: {
          goToBehaviorModelsTab: true
        }});
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      const dialogRef = this.dialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.router.navigate(['/', 'home'], { state: {
          goToBehaviorModelsTab: true
        }});
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }
  }

}