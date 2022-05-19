import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelDeleteConfirmModalComponent } from './behavior-model-delete-confirm-modal.component';

describe('BehaviorModelDeleteConfirmModalComponent', () => {
  let component: BehaviorModelDeleteConfirmModalComponent;
  let fixture: ComponentFixture<BehaviorModelDeleteConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelDeleteConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelDeleteConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
