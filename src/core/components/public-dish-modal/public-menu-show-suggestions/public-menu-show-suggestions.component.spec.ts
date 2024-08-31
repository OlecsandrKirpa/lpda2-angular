import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMenuShowSuggestionsComponent } from './public-menu-show-suggestions.component';

describe('PublicMenuShowSuggestionsComponent', () => {
  let component: PublicMenuShowSuggestionsComponent;
  let fixture: ComponentFixture<PublicMenuShowSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMenuShowSuggestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicMenuShowSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
