import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesTextInputComponent } from './preferences-text-input.component';

describe('PreferencesTextInputComponent', () => {
  let component: PreferencesTextInputComponent;
  let fixture: ComponentFixture<PreferencesTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesTextInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreferencesTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
