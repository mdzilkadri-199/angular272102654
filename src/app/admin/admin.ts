import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { Content } from "../content/content"; 
import { Footer } from "../footer/footer";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [Header, Sidebar, Content, Footer],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {

}
