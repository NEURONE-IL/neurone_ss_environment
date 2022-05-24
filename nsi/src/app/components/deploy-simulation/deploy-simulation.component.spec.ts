import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploySimulationComponent } from './deploy-simulation.component';

describe('DeploySimulationComponent', () => {
  let component: DeploySimulationComponent;
  let fixture: ComponentFixture<DeploySimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploySimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploySimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
