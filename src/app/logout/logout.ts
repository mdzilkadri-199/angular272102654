import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  constructor(private cookieService : CookieService, private router: Router){}

  ngOnInit(): void{
    // hapus cookie atau token autentifikasi
    this.cookieService.deleteAll();

    // arahkan ke halaman login
    this.router.navigate(['/login']);
    
  }
}
