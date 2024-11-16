import { Component, effect, inject } from '@angular/core';
import { User } from '@core/models/user';
import { ProfileService } from '@core/services/http/profile.service';
import { TuiButtonModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
// import { PageTitleComponent } from '../page-title/page-title.component';
import { MatIconModule } from '@angular/material/icon';
import { ProfileItemComponent } from './components/profile-item/profile-item.component';
import { CommonModule, DatePipe } from '@angular/common';
// import { UserStatusComponent } from '../user-status/user-status.component';
import { TuiAccordionModule, TuiInputModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { EditFullnameComponent } from './components/edit-fullname/edit-fullname.component';
import { RouterModule } from '@angular/router';
import { EditUsernameComponent } from './components/edit-username/edit-username.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // PageTitleComponent,
    TuiLoaderModule,
    MatIconModule,
    ProfileItemComponent,
    // UserStatusComponent,
    DatePipe,
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiButtonModule,
    EditFullnameComponent,
    TuiAccordionModule,
    EditUsernameComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  public user?: User | null;
  public deleteAccordionOpen: boolean = false;

  private readonly profile: ProfileService = inject(ProfileService);

  constructor() {
    effect(() => {
      // this.user = this.profile.currentUser$();
      this.user = this.profile.cu();
    });
  }

  onEdit(item: ProfileItemComponent): void {
  }
}
