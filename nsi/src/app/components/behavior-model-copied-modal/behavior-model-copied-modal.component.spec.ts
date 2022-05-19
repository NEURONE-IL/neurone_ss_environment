import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelCopiedModalComponent } from './behavior-model-copied-modal.component';

describe('BehaviorModelCopiedModalComponent', () => {
  let component: BehaviorModelCopiedModalComponent;
  let fixture: ComponentFixture<BehaviorModelCopiedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelCopiedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelCopiedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
