import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { HighchartsChartModule } from 'highcharts-angular';

import { AppComponent } from './app.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { WatchlistPageComponent } from './Components/watchlist-page/watchlist-page.component';
import { PortfolioPageComponent } from './Components/portfolio-page/portfolio-page.component';
import { FooterComponent } from './Components/footer/footer.component';
import { DetailsPageComponent } from './Components/details-page/details-page.component';
import { SummaryComponent } from './Components/details-page/summary/summary.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeneralComponent } from './Components/details-page/general/general.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomePageComponent,
    WatchlistPageComponent,
    PortfolioPageComponent,
    FooterComponent,
    DetailsPageComponent,
    SummaryComponent,
    GeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
