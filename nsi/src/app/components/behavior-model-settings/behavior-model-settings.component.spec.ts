import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelSettingsComponent } from './behavior-model-settings.component';

describe('BehaviorModelSettingsComponent', () => {
  let component: BehaviorModelSettingsComponent;
  let fixture: ComponentFixture<BehaviorModelSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
