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
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getMatPaginatorIntl } from '../locale/matpaginator-intl';

import { CdTimerModule } from 'angular-cd-timer';

import { AppComponent } from './app.component';

import { HomeComponent } from './components/home/home.component';
import { ModalErrorComponent } from './components/modal-error/modal-error.component';

import { BehaviorModelEditComponent } from './components/behaviormodel-edit/behaviormodel-edit.component';
import { BehaviorModelListComponent } from './components/behaviormodel-list/behaviormodel-list.component';
import { BehaviorModelModalAddedComponent } from './components/behaviormodel-modal-added/behaviormodel-modal-added.component';
import { BehaviorModelModalConfirmDeleteComponent } from './components/behaviormodel-modal-confirmdelete/behaviormodel-modal-confirmdelete.component';
import { BehaviorModelModalCopiedComponent } from './components/behaviormodel-modal-copied/behaviormodel-modal-copied.component';
import { BehaviorModelModalDeletedComponent } from './components/behaviormodel-modal-deleted/behaviormodel-modal-deleted.component';
import { BehaviorModelModalEditedComponent } from './components/behaviormodel-modal-edited/behaviormodel-modal-edited.component';
import { BehaviorModelModalHasErrorsComponent } from './components/behaviormodel-modal-haserrors/behaviormodel-modal-haserrors.component';
import { BehaviorModelModalInUseComponent } from './components/behaviormodel-modal-inuse/behaviormodel-modal-inuse.component';
import { BehaviorModelModalNodeSettingsBUEComponent } from './components/behaviormodel-modal-nodesettingsbue/behaviormodel-modal-nodesettingsbue.component';
import { BehaviorModelModalNodeSettingsPSComponent } from './components/behaviormodel-modal-nodesettingsps/behaviormodel-modal-nodesettingsps.component';
import { BehaviorModelModalNodeSettingsQComponent } from './components/behaviormodel-modal-nodesettingsq/behaviormodel-modal-nodesettingsq.component';
import { BehaviorModelModalNotFoundComponent } from './components/behaviormodel-modal-notfound/behaviormodel-modal-notfound.component';
import { BehaviorModelModalProbSettingsComponent } from './components/behaviormodel-modal-probsettings/behaviormodel-modal-probsettings.component';
import { BehaviorModelNewComponent } from './components/behaviormodel-new/behaviormodel-new.component';
import { BehaviorModelSettingsComponent } from './components/behaviormodel-settings/behaviormodel-settings.component';

import { SimulationDeployComponent } from './components/simulation-deploy/simulation-deploy.component';
import { SimulationEditComponent } from './components/simulation-edit/simulation-edit.component';
import { SimulationEditQueryListComponent } from './components/simulation-editquerylist/simulation-editquerylist.component';
import { SimulationListComponent } from './components/simulation-list/simulation-list.component';
import { SimulationModalAddedComponent } from './components/simulation-modal-added/simulation-modal-added.component';
import { SimulationModalConfirmDeleteComponent } from './components/simulation-modal-confirmdelete/simulation-modal-confirmdelete.component';
import { SimulationModalConfirmDeployLeaveComponent } from './components/simulation-modal-confirmdeployleave/simulation-modal-confirmdeployleave.component';
import { SimulationModalCopiedComponent } from './components/simulation-modal-copied/simulation-modal-copied.component';
import { SimulationModalDeletedComponent } from './components/simulation-modal-deleted/simulation-modal-deleted.component';
import { SimulationModalEditedComponent } from './components/simulation-modal-edited/simulation-modal-edited.component';
import { SimulationModalModelNotFoundComponent } from './components/simulation-modal-modelnotfound/simulation-modal-modelnotfound.component';
import { SimulationModalNotDeployableComponent } from './components/simulation-modal-notdeployable/simulation-modal-notdeployable.component';
import { SimulationModalNoModelsComponent } from './components/simulation-modal-nomodels/simulation-modal-nomodels.component';
import { SimulationModalSimNotFoundComponent } from './components/simulation-modal-simnotfound/simulation-modal-simnotfound.component';
import { SimulationNewComponent } from './components/simulation-new/simulation-new.component';
import { SimulationNewQueryListComponent } from './components/simulation-newquerylist/simulation-newquerylist.component';
import { SimulationSettingsComponent } from './components/simulation-settings/simulation-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalErrorComponent,
    BehaviorModelEditComponent,
    BehaviorModelListComponent,
    BehaviorModelModalAddedComponent,
    BehaviorModelModalConfirmDeleteComponent,
    BehaviorModelModalCopiedComponent,
    BehaviorModelModalDeletedComponent,
    BehaviorModelModalEditedComponent,
    BehaviorModelModalHasErrorsComponent,
    BehaviorModelModalInUseComponent,
    BehaviorModelModalNodeSettingsBUEComponent,
    BehaviorModelModalNodeSettingsPSComponent,
    BehaviorModelModalNodeSettingsQComponent,
    BehaviorModelModalNotFoundComponent,
    BehaviorModelModalProbSettingsComponent,
    BehaviorModelNewComponent,
    BehaviorModelSettingsComponent,
    SimulationDeployComponent,
    SimulationEditComponent,
    SimulationEditQueryListComponent,
    SimulationListComponent,
    SimulationModalAddedComponent,
    SimulationModalConfirmDeleteComponent,
    SimulationModalConfirmDeployLeaveComponent,
    SimulationModalCopiedComponent,
    SimulationModalDeletedComponent,
    SimulationModalEditedComponent,
    SimulationModalModelNotFoundComponent,
    SimulationModalNotDeployableComponent,
    SimulationModalNoModelsComponent,
    SimulationModalSimNotFoundComponent,
    SimulationNewComponent,
    SimulationNewQueryListComponent,
    SimulationSettingsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'behaviormodel-new', component: BehaviorModelNewComponent},
      {path: 'behaviormodel-edit', component: BehaviorModelEditComponent},
      {path: 'behaviormodel-settings', component: BehaviorModelSettingsComponent},
      {path: 'simulation-new', component: SimulationNewComponent},
      {path: 'simulation-newquerylist', component: SimulationNewQueryListComponent},
      {path: 'simulation-settings', component: SimulationSettingsComponent},
      {path: 'simulation-edit', component: SimulationEditComponent},
      {path: 'simulation-editquerylist', component: SimulationEditQueryListComponent},
      {path: 'simulation-deploy', component: SimulationDeployComponent},
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
    MatSnackBarModule,
    MatPaginatorModule,
    CdTimerModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getMatPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
