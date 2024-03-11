import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nInputComponent } from './i18n-input.component';

describe('I18nInputComponent', () => {
  let component: I18nInputComponent;
  let fixture: ComponentFixture<I18nInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I18nInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
