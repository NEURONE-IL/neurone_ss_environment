import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { BehaviorModelListComponent } from './components/behavior-model-list/behavior-model-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NewBehaviorModelComponent } from './components/new-behavior-model/new-behavior-model.component';
import { NewBehaviorModelProbabilityModalComponent } from './components/new-behavior-model-probability-modal/new-behavior-model-probability-modal.component';
import { NewSimulationComponent } from './components/new-simulation/new-simulation.component';
import { SimulationListComponent } from './components/simulation-list/simulation-list.component';
import { SimulationAddedModalComponent } from './components/simulation-added-modal/simulation-added-modal.component';
import { SimulationDeletedModalComponent } from './components/simulation-deleted-modal/simulation-deleted-modal.component';
import { SimulationCopiedModalComponent } from './components/simulation-copied-modal/simulation-copied-modal.component';
import { SimulationDeleteConfirmModalComponent } from './components/simulation-delete-confirm-modal/simulation-delete-confirm-modal.component';
import { NewBehaviorModelNodeSettingsQueryModalComponent } from './components/new-behavior-model-node-settings-query-modal/new-behavior-model-node-settings-query-modal.component';
import { NewBehaviorModelNodeSettingsPageserpModalComponent } from './components/new-behavior-model-node-settings-pageserp-modal/new-behavior-model-node-settings-pageserp-modal.component';
import { NewBehaviorModelNodeSettingsEndbookunbookModalComponent } from './components/new-behavior-model-node-settings-endbookunbook-modal/new-behavior-model-node-settings-endbookunbook-modal.component';
import { QueryListComponent } from './components/query-list/query-list.component';
import { BehaviorModelAddedModalComponent } from './components/behavior-model-added-modal/behavior-model-added-modal.component';
import { BehaviorModelCopiedModalComponent } from './components/behavior-model-copied-modal/behavior-model-copied-modal.component';
import { BehaviorModelDeleteConfirmModalComponent } from './components/behavior-model-delete-confirm-modal/behavior-model-delete-confirm-modal.component';
import { BehaviorModelDeletedModalComponent } from './components/behavior-model-deleted-modal/behavior-model-deleted-modal.component';
import { SimulationSettingsComponent } from './components/simulation-settings/simulation-settings.component';
import { BehaviorModelHasErrorsModalComponent } from './components/behavior-model-has-errors-modal/behavior-model-has-errors-modal.component';
import { SimulationNoValidModelsModalComponent } from './components/simulation-no-valid-models-modal/simulation-no-valid-models-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    BehaviorModelListComponent,
    HomePageComponent,
    NewBehaviorModelComponent,
    NewBehaviorModelProbabilityModalComponent,
    NewSimulationComponent,
    SimulationListComponent,
    SimulationAddedModalComponent,
    SimulationDeletedModalComponent,
    SimulationCopiedModalComponent,
    SimulationDeleteConfirmModalComponent,
    NewBehaviorModelNodeSettingsQueryModalComponent,
    NewBehaviorModelNodeSettingsPageserpModalComponent,
    NewBehaviorModelNodeSettingsEndbookunbookModalComponent,
    QueryListComponent,
    BehaviorModelAddedModalComponent,
    BehaviorModelCopiedModalComponent,
    BehaviorModelDeleteConfirmModalComponent,
    BehaviorModelDeletedModalComponent,
    SimulationSettingsComponent,
    BehaviorModelHasErrorsModalComponent,
    SimulationNoValidModelsModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'home', component: HomePageComponent},
      {path: 'new-behavior-model', component: NewBehaviorModelComponent},
      {path: 'new-simulation', component: NewSimulationComponent},
      {path: 'query-list', component: QueryListComponent},
      {path: 'simulation-settings', component: SimulationSettingsComponent},
      {path: '**', redirectTo: 'home', pathMatch: 'full'}],
      {scrollPositionRestoration: 'enabled'}
    ),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
