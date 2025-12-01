import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit{
  @Input() moduleName: string = "";
  username: string ="";

  constructor(private cookieService: CookieService,private router: Router) {}

  ngOnInit(): void {
    this.username = this.cookieService.get("userId");
  }

  onMenuClick() {
    
    if (window.innerWidth < 768) {
      document.body.classList.remove("sidebar-open");
      document.body.classList.add("sidebar-closed");
      document.body.classList.add("sidebar-collapse");
    }
  }
}