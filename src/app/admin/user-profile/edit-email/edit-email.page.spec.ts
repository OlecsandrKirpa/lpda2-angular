import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailPage } from './edit-email.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '@core/services/http/profile.service';
import { WritableSignal, signal } from '@angular/core';
import { User } from '@core/models/user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditEmailPage', () => {
  let component: EditEmailPage;
  let fixture: ComponentFixture<EditEmailPage>;
  const currentUser$: WritableSignal<User | undefined> = signal(undefined);
  let profileService;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj('ProfileService', ['load', 'update'], {currentUser$});

    await TestBed.configureTestingModule({
      imports: [
        EditEmailPage,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ProfileService, useValue: profileService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
