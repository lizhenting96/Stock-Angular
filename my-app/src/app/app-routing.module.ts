import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './Components/home-page/home-page.component'
import { WatchlistPageComponent } from './Components/watchlist-page/watchlist-page.component'
import { PortfolioPageComponent } from './Components/portfolio-page/portfolio-page.component'
import { DetailsPageComponent } from './Components/details-page/details-page.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent},
  { path: 'watchlist', pathMatch: 'full', component: WatchlistPageComponent},
  { path: 'portfolio', pathMatch: 'full', component: PortfolioPageComponent},
  { path: 'details/:ticker', pathMatch: 'prefix',component: DetailsPageComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

