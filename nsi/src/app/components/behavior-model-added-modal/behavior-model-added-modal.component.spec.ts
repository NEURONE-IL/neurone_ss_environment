import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelAddedModalComponent } from './behavior-model-added-modal.component';

describe('BehaviorModelAddedModalComponent', () => {
  let component: BehaviorModelAddedModalComponent;
  let fixture: ComponentFixture<BehaviorModelAddedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelAddedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelAddedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
