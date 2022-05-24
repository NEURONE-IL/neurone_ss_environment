import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelEditedModalComponent } from './behavior-model-edited-modal.component';

describe('BehaviorModelEditedModalComponent', () => {
  let component: BehaviorModelEditedModalComponent;
  let fixture: ComponentFixture<BehaviorModelEditedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelEditedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelEditedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
