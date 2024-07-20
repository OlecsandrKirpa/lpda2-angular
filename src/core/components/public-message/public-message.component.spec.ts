import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMessageComponent } from './public-message.component';

describe('PublicMessageComponent', () => {
  let component: PublicMessageComponent;
  let fixture: ComponentFixture<PublicMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
