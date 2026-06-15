import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout implements OnInit {
  constructor(private cookieService : CookieService, private router: Router, private renderer: Renderer2){}

  ngOnInit(): void{
    // 3. Hapus class dark-mode dari body global sebelum pindah halaman
    this.renderer.removeClass(document.body, 'dark-mode');
    
    // hapus cookie atau token autentifikasi
    this.cookieService.deleteAll();

    // arahkan ke halaman login
    this.router.navigate(['/login']);
    
  }
}
