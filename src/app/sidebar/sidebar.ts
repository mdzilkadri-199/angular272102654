import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
  @Input() moduleName: string = "";
  username: string = "";

  constructor(
    private cookieService: CookieService, private router: Router, private renderer: Renderer2 
  ) {}

  ngOnInit(): void {
    this.username = this.cookieService.get("userId");
    this.applyInitialTheme();
  }

  private applyInitialTheme(): void {
    const savedTheme = localStorage.getItem('adminlte-theme');
    const header = document.querySelector('.main-header');

    if (savedTheme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
      if (header) {
        this.updateHeaderClasses(header, true);
      }
    }
  }

  toggleTheme(): void {
    const body = document.body;
    const header = document.querySelector('.main-header');
    const isNowDark = !body.classList.contains('dark-mode');

    if (isNowDark) {
      this.renderer.addClass(body, 'dark-mode');
      localStorage.setItem('adminlte-theme', 'dark');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
      localStorage.setItem('adminlte-theme', 'light');
    }

    if (header) {
      this.updateHeaderClasses(header, isNowDark);
    }
  }


  private updateHeaderClasses(header: Element, isDark: boolean): void {
    if (isDark) {
      this.renderer.removeClass(header, 'navbar-white');
      this.renderer.removeClass(header, 'navbar-light');
      this.renderer.addClass(header, 'navbar-dark');
      this.renderer.addClass(header, 'bg-dark'); 
    } else {
      this.renderer.removeClass(header, 'navbar-dark');
      this.renderer.removeClass(header, 'bg-dark');
      this.renderer.addClass(header, 'navbar-white');
      this.renderer.addClass(header, 'navbar-light');
    }
  }

   onMenuClick() {

    if (window.innerWidth < 768) {
    document.body.classList.remove("sidebar-open");
    document.body.classList.add("sidebar-closed");
    document.body.classList.add("sidebar-collapse"); 
    }
  }
}