import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModelProbabilityModalComponent } from './app-new-model-probability-modal.component';

describe('NewModelProbabilityModalComponent', () => {
  let component: NewModelProbabilityModalComponent;
  let fixture: ComponentFixture<NewModelProbabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewModelProbabilityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModelProbabilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
