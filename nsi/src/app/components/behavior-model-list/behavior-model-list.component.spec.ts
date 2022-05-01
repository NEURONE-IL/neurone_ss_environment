import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorModelListComponent } from './behavior-model-list.component';

describe('BehaviorModelListComponent', () => {
  let component: BehaviorModelListComponent;
  let fixture: ComponentFixture<BehaviorModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorModelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
