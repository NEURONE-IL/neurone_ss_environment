import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationCopiedModalComponent } from './simulation-copied-modal.component';

describe('SimulationCopiedModalComponent', () => {
  let component: SimulationCopiedModalComponent;
  let fixture: ComponentFixture<SimulationCopiedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationCopiedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationCopiedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
