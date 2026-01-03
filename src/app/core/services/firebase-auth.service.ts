import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private app: FirebaseApp = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private router: Router) {
    onAuthStateChanged(this.auth, async (user) => {
      this.userSubject.next(user);
      if (user) {
        await this.checkSuperAdminRole(user);
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      
      if (user) {
        await this.checkSuperAdminRole(user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  private async checkSuperAdminRole(user: User): Promise<void> {
    const tokenResult = await user.getIdTokenResult();
    const role = tokenResult.claims['role'];
    
    if (role !== 'super_admin') {
      await this.logout();
      throw new Error('Access denied: Super Admin role required');
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable(observer => {
      this.user$.subscribe(user => {
        observer.next(!!user);
      });
    });
  }
}

