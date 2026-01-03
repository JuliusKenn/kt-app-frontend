import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// ngx-graph
import { NgxGraphModule } from '@swimlane/ngx-graph';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { FamilyTreeListComponent } from './features/family-tree/family-tree-list/family-tree-list.component';
import { FamilyTreeFormComponent } from './features/family-tree/family-tree-form/family-tree-form.component';
import { FamilyTreeDetailComponent } from './features/family-tree/family-tree-detail/family-tree-detail.component';

// Guards & Interceptors
import { AuthGuard } from './core/guards/auth.guard';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'family-trees', component: FamilyTreeListComponent, canActivate: [AuthGuard] },
  { path: 'family-trees/:id', component: FamilyTreeDetailComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/family-trees', pathMatch: 'full' },
  { path: '**', redirectTo: '/family-trees' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FamilyTreeListComponent,
    FamilyTreeFormComponent,
    FamilyTreeDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxGraphModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

