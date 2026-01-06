import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = 'angular272102654';

  constructor(private router: Router) {
    // Menjalankan inisialisasi ulang layout setiap kali rute berubah
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initLayout();
      }
    });
  }

  private initLayout() {
    // Menggunakan timeout singkat agar DOM selesai dimuat sebelum jQuery bekerja
    setTimeout(() => {
      if (typeof $ !== 'undefined') {
        // Mengaktifkan fitur Sidebar dan Menu Dropdown AdminLTE
        if ($.fn.PushMenu) $('[data-widget="pushmenu"]').PushMenu('init');
        if ($.fn.Treeview) $('[data-widget="treeview"]').Treeview('init');
        
        // Memastikan posisi layout (sidebar/footer) sinkron
        if ($.AdminLTE && $.AdminLTE.layout) {
          $.AdminLTE.layout.fix();
        }
      }
    }, 150);
  }
}