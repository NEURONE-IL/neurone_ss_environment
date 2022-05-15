import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationAddedModalComponent } from './simulation-added-modal.component';

describe('SimulationAddedModalComponent', () => {
  let component: SimulationAddedModalComponent;
  let fixture: ComponentFixture<SimulationAddedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationAddedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationAddedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
