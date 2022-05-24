import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationNotDeployableModalComponent } from './simulation-not-deployable-modal.component';

describe('SimulationNotDeployableModalComponent', () => {
  let component: SimulationNotDeployableModalComponent;
  let fixture: ComponentFixture<SimulationNotDeployableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationNotDeployableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationNotDeployableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
