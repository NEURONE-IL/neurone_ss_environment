import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelInUseModalComponent } from './behavior-model-in-use-modal.component';

describe('BehaviorModelInUseModalComponent', () => {
  let component: BehaviorModelInUseModalComponent;
  let fixture: ComponentFixture<BehaviorModelInUseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelInUseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelInUseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
