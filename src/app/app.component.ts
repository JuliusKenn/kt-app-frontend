import { Component } from '@angular/core';
import { FirebaseAuthService } from './core/services/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KinTree';

  constructor(public authService: FirebaseAuthService) {}
}

