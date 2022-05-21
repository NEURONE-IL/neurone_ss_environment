import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelHasErrorsModalComponent } from './behavior-model-has-errors-modal.component';

describe('BehaviorModelHasErrorsModalComponent', () => {
  let component: BehaviorModelHasErrorsModalComponent;
  let fixture: ComponentFixture<BehaviorModelHasErrorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelHasErrorsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelHasErrorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
