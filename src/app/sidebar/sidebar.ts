import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit {
  @Input() moduleName: string = "";
  username: string = "";
   isDashboardOpen: boolean = false;
   isDarkMode: boolean = false

   private overlayClickListener: (() => void) | null = null;

  constructor(
    private cookieService: CookieService, private router: Router, private renderer: Renderer2 
  ) {}

  ngOnInit(): void {
    this.username = this.cookieService.get("userId");
    this.applyInitialTheme();

    const dashboardModules = ['dashboard', 'dashboard2', 'dashboard3'];
  this.isDashboardOpen = dashboardModules.includes(this.moduleName);

      this.overlayClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      if (window.innerWidth < 768) {
        const sidebar = document.querySelector('.main-sidebar');
        const target = event.target as HTMLElement;
        const clickedInsideSidebar = sidebar?.contains(target);
        const clickedOnToggle = target.closest('[data-widget="pushmenu"]');

        if (!clickedInsideSidebar && !clickedOnToggle) {
          this.closeSidebar();
        }
      }
    });
  }
  ngOnDestroy(): void {
    // bersihkan listener saat komponen destroyed
    if (this.overlayClickListener) {
      this.overlayClickListener();
    }
  }
  private closeSidebar(): void {
    document.body.classList.remove("sidebar-open");
    document.body.classList.add("sidebar-closed");
    document.body.classList.add("sidebar-collapse");
  }

  
  private applyInitialTheme(): void {
    const savedTheme = localStorage.getItem('adminlte-theme');
    const header = document.querySelector('.main-header');

    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'dark-mode');
      if (header) {
        this.updateHeaderClasses(header, true);
      }
    }else {
      this.isDarkMode = false;
  }
  }
  toggleTheme(): void {
    const body = document.body;
    const header = document.querySelector('.main-header');
    const isNowDark = !body.classList.contains('dark-mode');

    this.isDarkMode = isNowDark;
    
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
      this.closeSidebar(); 
    }
  }

  toggleDashboard(event: Event): void {
    event.preventDefault();
    event.stopPropagation(); 
    this.isDashboardOpen = !this.isDashboardOpen;

    
  }

}