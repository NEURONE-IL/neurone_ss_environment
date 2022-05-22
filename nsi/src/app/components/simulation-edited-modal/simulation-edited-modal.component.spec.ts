import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationEditedModalComponent } from './simulation-edited-modal.component';

describe('SimulationEditedModalComponent', () => {
  let component: SimulationEditedModalComponent;
  let fixture: ComponentFixture<SimulationEditedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationEditedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationEditedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
