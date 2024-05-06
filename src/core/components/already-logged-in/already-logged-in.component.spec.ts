import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyLoggedInComponent } from './already-logged-in.component';

describe('AlreadyLoggedInComponent', () => {
  let component: AlreadyLoggedInComponent;
  let fixture: ComponentFixture<AlreadyLoggedInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlreadyLoggedInComponent]
    });
    fixture = TestBed.createComponent(AlreadyLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
