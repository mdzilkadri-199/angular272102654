import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = 'angular272102654';
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Inisialisasi saat app pertama kali dimuat
    this.initializeAdminLTEWithDelay(100);
    
    // Re-initialize when route changes (dengan debounce untuk hindari multiple calls)
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        debounceTime(50) // Tunggu 50ms setelah navigasi selesai
      )
      .subscribe(() => {
        this.initializeAdminLTEWithDelay(150);
      });
  }

  ngOnDestroy() {
    // Bersihkan subscription untuk hindari memory leak
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private initializeAdminLTEWithDelay(delay: number = 100) {
    setTimeout(() => {
      this.initializeAdminLTE();
    }, delay);
  }

  private initializeAdminLTE() {
    if (typeof $ !== 'undefined') {
      try {
        // Initialize semua komponen AdminLTE yang umum
        if ($.fn.Treeview) {
          $('[data-widget="treeview"]').Treeview('init');
        }
        
        if ($.fn.PushMenu) {
          $('[data-widget="pushmenu"]').PushMenu('init');
        }
        
        // Fix layout AdminLTE jika tersedia
        if ($.AdminLTE && $.AdminLTE.layout) {
          $.AdminLTE.layout.activate();
          $.AdminLTE.layout.fix();
          $.AdminLTE.layout.fixSidebar();
        }
        
        console.log('AdminLTE initialized/re-initialized');
      } catch (error) {
        console.warn('Error initializing AdminLTE:', error);
      }
    }
  }
}