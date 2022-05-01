import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBehaviorModelComponent } from './new-behavior-model.component';

describe('NewBehaviorModelComponent', () => {
  let component: NewBehaviorModelComponent;
  let fixture: ComponentFixture<NewBehaviorModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBehaviorModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBehaviorModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
