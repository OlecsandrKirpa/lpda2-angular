import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { signal } from '@angular/core';
import { User } from '@core/models/user';
import { ProfileService } from '@core/services/http/profile.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let profileService: ProfileService;
  const currentUser$ = signal<User | undefined>(undefined);

  beforeEach(async () => {
    profileService = jasmine.createSpyObj('ProfileService', {currentUser$});

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [{ provide: ProfileService, useValue: profileService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
