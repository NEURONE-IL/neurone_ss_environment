import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBehaviorModelComponent } from './edit-behavior-model.component';

describe('EditBehaviorModelComponent', () => {
  let component: EditBehaviorModelComponent;
  let fixture: ComponentFixture<EditBehaviorModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBehaviorModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBehaviorModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
