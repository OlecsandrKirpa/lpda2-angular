import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailToComponent } from './mail-to.component';

describe('MailToComponent', () => {
  let component: MailToComponent;
  let fixture: ComponentFixture<MailToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailToComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
