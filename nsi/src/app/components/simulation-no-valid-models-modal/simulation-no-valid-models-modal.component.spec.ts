import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationNoValidModelsModalComponent } from './simulation-no-valid-models-modal.component';

describe('SimulationNoValidModelsModalComponent', () => {
  let component: SimulationNoValidModelsModalComponent;
  let fixture: ComponentFixture<SimulationNoValidModelsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationNoValidModelsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationNoValidModelsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
