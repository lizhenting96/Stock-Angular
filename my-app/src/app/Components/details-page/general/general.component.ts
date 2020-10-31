import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../../../Services/local-storage.service'
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  @Input('companyDescription') companyDescription: any
  @Input('lastPrice') lastPrice: string
  @Input('change') change: string
  @Input('changePercent') changePercent: string
  @Input('curTimeStamp') curTimeStamp: string
  @Input('changeStatus') changeStatus: string
  @Input('popBuyEvent') popBuyEvent: Observable<void>

  @Output('buyOnClick') buyOnClick: EventEmitter<any> = new EventEmitter()

  // Pop up messages
  private _watchlist = new Subject<string>()
  private _portfolio = new Subject<string>()
  private eventsSubscription: Subscription;
  watchlistMessage = ''
  portfolioMessage = ''
  // check ticker
  tickerAlreadyWatched: boolean = false

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    if (this.localStorageService.isInWatchlist(this.companyDescription.ticker)) {
      this.tickerAlreadyWatched = true
    }

    this._watchlist.subscribe(message => this.watchlistMessage = message);
    this._watchlist.pipe(
      debounceTime(5000)
    ).subscribe(() => this.watchlistMessage = '');
    this._portfolio.subscribe(message => this.portfolioMessage = message)
    this._portfolio.pipe(
      debounceTime(5000)
    ).subscribe(() => this.portfolioMessage = '')

    this.eventsSubscription = this.popBuyEvent.subscribe(() => {
      this._portfolio.next(`${this.companyDescription.ticker} bought successfully!`)
    })
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  starOnClick(): void {
    if (this.tickerAlreadyWatched) {
      this.localStorageService.removeFromWatchlist(this.companyDescription.ticker)
      this._watchlist.next(`${this.companyDescription.ticker} removed from Watchlist.`);
    }
    else {
      this.localStorageService.addToWatchlist(this.companyDescription.ticker, this.companyDescription.name)
      this._watchlist.next(`${this.companyDescription.ticker} added to Watchlist.`);
    }
    this.tickerAlreadyWatched = !this.tickerAlreadyWatched
  }
}
