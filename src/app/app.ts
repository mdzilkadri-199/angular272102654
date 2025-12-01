import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, Component, provideZoneChangeDetection, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('angular272102654')

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize on app start - juga dengann window load event
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.initializeAdminLTE();
      }, 1000);
    });

    // Juga initialize dengan timeout biasa
    setTimeout(() => {
      this.initializeAdminLTE();
    }, 2000);

    // Re-initialize when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.initializeAdminLTE();
        }, 300);
      });
  }

  initializeAdminLTE() {
    if (typeof $ !== 'undefined' && $.fn.Treeview) {
      $('[data-widget="treeview"]').Treeview('init');
      console.log('AdminLTE initialized');
    }
  }
}