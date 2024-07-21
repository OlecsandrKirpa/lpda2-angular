import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleCountInputComponent } from './people-count-input.component';

describe('PeopleCountInputComponent', () => {
  let component: PeopleCountInputComponent;
  let fixture: ComponentFixture<PeopleCountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleCountInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeopleCountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
