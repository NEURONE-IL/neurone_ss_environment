import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule} from '@angular/router';

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

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SimulationListComponent } from './components/simulation-list/simulation-list.component';
import { ModelListComponent } from './components/model-list/model-list.component';
import { NewModelProbabilityModalComponent } from './components/new-model-probability-modal/new-model-probability-modal.component';
import { NewModelComponent } from './components/new-model/new-model.component';
import { NewSimulationComponent } from './components/new-simulation/new-simulation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SimulationListComponent,
    ModelListComponent,
    NewModelProbabilityModalComponent,
    NewModelComponent,
    NewSimulationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'home', component: HomePageComponent},
      {path: 'new-model', component: NewModelComponent},
      {path: 'new-simulation', component: NewSimulationComponent},
      {path: '**', redirectTo: 'home', pathMatch: 'full'},
    ]),
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
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
