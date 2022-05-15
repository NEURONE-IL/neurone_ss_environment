import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDeletedModalComponent } from './simulation-deleted-modal.component';

describe('SimulationDeletedModalComponent', () => {
  let component: SimulationDeletedModalComponent;
  let fixture: ComponentFixture<SimulationDeletedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulationDeletedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationDeletedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
