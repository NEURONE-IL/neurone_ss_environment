import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBehaviorModelNodeSettingsQueryModalComponent } from './new-behavior-model-node-settings-query-modal.component';

describe('NewBehaviorModelNodeSettingsQueryModalComponent', () => {
  let component: NewBehaviorModelNodeSettingsQueryModalComponent;
  let fixture: ComponentFixture<NewBehaviorModelNodeSettingsQueryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBehaviorModelNodeSettingsQueryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBehaviorModelNodeSettingsQueryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
