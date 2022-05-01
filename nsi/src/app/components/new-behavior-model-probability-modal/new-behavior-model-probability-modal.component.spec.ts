import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBehaviorModelProbabilityModalComponent } from './app-new-behavior-model-probability-modal.component';

describe('NewBehaviorModelProbabilityModalComponent', () => {
  let component: NewBehaviorModelProbabilityModalComponent;
  let fixture: ComponentFixture<NewBehaviorModelProbabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBehaviorModelProbabilityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBehaviorModelProbabilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
