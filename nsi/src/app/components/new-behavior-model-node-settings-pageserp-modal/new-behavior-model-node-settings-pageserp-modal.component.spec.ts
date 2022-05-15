import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBehaviorModelNodeSettingsPageserpModalComponent } from './new-behavior-model-node-settings-pageserp-modal.component';

describe('NewBehaviorModelNodeSettingsPageserpModalComponent', () => {
  let component: NewBehaviorModelNodeSettingsPageserpModalComponent;
  let fixture: ComponentFixture<NewBehaviorModelNodeSettingsPageserpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBehaviorModelNodeSettingsPageserpModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBehaviorModelNodeSettingsPageserpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
