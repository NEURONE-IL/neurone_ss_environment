import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBehaviorModelNodeSettingsEndbookunbookModalComponent } from './new-behavior-model-node-settings-endbookunbook-modal.component';

describe('NewBehaviorModelNodeSettingsEndbookunbookModalComponent', () => {
  let component: NewBehaviorModelNodeSettingsEndbookunbookModalComponent;
  let fixture: ComponentFixture<NewBehaviorModelNodeSettingsEndbookunbookModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBehaviorModelNodeSettingsEndbookunbookModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBehaviorModelNodeSettingsEndbookunbookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
