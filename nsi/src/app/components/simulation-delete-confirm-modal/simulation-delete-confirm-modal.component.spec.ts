import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDeleteConfirmModalComponent } from './simulation-delete-confirm-modal.component';

describe('SimulationDeleteConfirmModalComponent', () => {
  let component: SimulationDeleteConfirmModalComponent;
  let fixture: ComponentFixture<SimulationDeleteConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationDeleteConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationDeleteConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
