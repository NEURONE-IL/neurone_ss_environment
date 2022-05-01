import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

import { AppComponent } from './app.component';
import { BehaviorModelListComponent } from './components/behavior-model-list/behavior-model-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NewBehaviorModelComponent } from './components/new-behavior-model/new-behavior-model.component';
import { NewBehaviorModelProbabilityModalComponent } from './components/new-behavior-model-probability-modal/new-behavior-model-probability-modal.component';
import { NewSimulationComponent } from './components/new-simulation/new-simulation.component';
import { SimulationListComponent } from './components/simulation-list/simulation-list.component';

@NgModule({
  declarations: [
    AppComponent,
    BehaviorModelListComponent,
    HomePageComponent,
    NewBehaviorModelComponent,
    NewBehaviorModelProbabilityModalComponent,
    NewSimulationComponent,
    SimulationListComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'home', component: HomePageComponent},
      {path: 'new-behavior-model', component: NewBehaviorModelComponent},
      {path: 'new-simulation', component: NewSimulationComponent},
      {path: '**', redirectTo: 'home', pathMatch: 'full'},
    ]),
    HttpClientModule,
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
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
