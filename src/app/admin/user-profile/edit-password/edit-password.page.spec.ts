import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPasswordPage } from './edit-password.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '@core/services/http/profile.service';
import { WritableSignal, signal } from '@angular/core';
import { User } from '@core/models/user';

describe('EditPasswordPage', () => {
  let component: EditPasswordPage;
  let fixture: ComponentFixture<EditPasswordPage>;
  const currentUser$: WritableSignal<User | undefined> = signal(undefined);
  let profileService;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj('ProfileService', ['load', 'changePassword'], {currentUser$});

    await TestBed.configureTestingModule({
      imports: [
        EditPasswordPage,
        RouterTestingModule,
      ],
      providers: [
        { provide: ProfileService, useValue: profileService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
