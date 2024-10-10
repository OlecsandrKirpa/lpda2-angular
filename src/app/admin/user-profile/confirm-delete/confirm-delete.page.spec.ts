import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeletePage } from './confirm-delete.page';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileService } from '@core/services/http/profile.service';
import { WritableSignal, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '@core/models/user';
import { of } from 'rxjs';

describe('ConfirmDeletePage', () => {
  let component: ConfirmDeletePage;
  let fixture: ComponentFixture<ConfirmDeletePage>;
  const currentUser$: WritableSignal<User | undefined> = signal(undefined);
  let profileService;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj(
      'ProfileService',
      {
        load: of(currentUser$()),
        delete: of()
      }
      , {currentUser$});

    await TestBed.configureTestingModule({
      imports: [
        ConfirmDeletePage,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ProfileService, useValue: profileService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
