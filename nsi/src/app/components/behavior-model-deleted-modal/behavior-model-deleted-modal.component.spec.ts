import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelDeletedModalComponent } from './behavior-model-deleted-modal.component';

describe('BehaviorModelDeletedModalComponent', () => {
  let component: BehaviorModelDeletedModalComponent;
  let fixture: ComponentFixture<BehaviorModelDeletedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelDeletedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelDeletedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
