import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFullnameComponent } from './edit-fullname.component';
import { WritableSignal, signal } from '@angular/core';
import { User } from '@core/models/user';
import { ProfileService } from '@core/services/http/profile.service';

describe('EditFullnameComponent', () => {
  let component: EditFullnameComponent;
  let fixture: ComponentFixture<EditFullnameComponent>;
  const currentUser$: WritableSignal<User|undefined> = signal(undefined);
  let profileService;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj('ProfileService', ['load', 'update'], {currentUser$});

    await TestBed.configureTestingModule({
      imports: [
        EditFullnameComponent
      ],
      providers: [
        { provide: ProfileService, useValue: profileService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFullnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
