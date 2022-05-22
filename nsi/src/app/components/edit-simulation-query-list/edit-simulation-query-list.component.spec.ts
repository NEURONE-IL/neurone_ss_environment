import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSimulationQueryListComponent } from './edit-simulation-query-list.component';

describe('EditSimulationQueryListComponent', () => {
  let component: EditSimulationQueryListComponent;
  let fixture: ComponentFixture<EditSimulationQueryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSimulationQueryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSimulationQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
