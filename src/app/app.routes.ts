import { Routes } from '@angular/router';
import { Dashboard} from './dashboard/dashboard';
import { Login } from './login/login';
import { Admin} from './admin/admin';
import { Dashboard2 } from './dashboard2/dashboard2';
import { Dashboard3 } from './dashboard3/dashboard3';
import { Mahasiswa } from './mahasiswa/mahasiswa';
import { otentikasiGuard } from './otentikasi-guard';
import { Logout } from './logout/logout';
import { Forex } from './forex/forex';
import { Cuaca } from './cuaca/cuaca';
import { Saham } from './saham/saham';
import { Crypto } from './crypto/crypto';
import { News } from './news/news';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'admin', component: Admin },
    {path: 'cuaca', component : Cuaca,canActivate: [otentikasiGuard]},
    {path: 'dashboard', component: Dashboard, canActivate: [otentikasiGuard] },
    {path: 'dashboard2', component: Dashboard2, canActivate: [otentikasiGuard] },
    {path: 'dashboard3', component: Dashboard3, canActivate: [otentikasiGuard] },
    {path: 'forex', component:Forex,canActivate:[otentikasiGuard]},
    {path: 'saham', component:Saham,canActivate:[otentikasiGuard]},
    {path: 'crypto', component: Crypto, canActivate: [otentikasiGuard]},
    {path: 'news', component: News, canActivate: [otentikasiGuard]},
    {path: 'login', component: Login },
    {path: 'mahasiswa', component:Mahasiswa, canActivate: [otentikasiGuard]},
    {path: 'logout', component: Logout }
    
    
];
