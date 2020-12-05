import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../Services/local-storage.service'
import { SearchService } from '../../Services/search.service'

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnInit {

  watchlist: any
  tickerNamesArr: string[] = []
  tickerInfoObj: any = {}
  dataReady: boolean = false

  constructor(
    private searchService: SearchService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.watchlist = this.localStorageService.getAllWatchlist()
    this.tickerNamesArr = Object.keys(this.watchlist)
    if (this.tickerNamesArr.length > 0) {
      this.searchService.getLatestPrice(this.tickerNamesArr.toString()).subscribe(results => {
        var tmpChange: number, tmpChangeStatus: string
        for (let i = 0; i < results.length; i++) {
          tmpChange = results[i].last - results[i].prevClose
          if (tmpChange > 0) {
            tmpChangeStatus = 'POSITIVE'
          }
          else if (tmpChange == 0) {
            tmpChangeStatus = 'ZERO'
          }
          else {
            tmpChangeStatus = 'NEGATIVE'
          }
          this.tickerInfoObj[results[i].ticker] = {
            companyName: this.watchlist[results[i].ticker],
            last: results[i].last,
            change: tmpChange,
            changePercent: (tmpChange * 100 / results[i].prevClose),
            changeStatus: tmpChangeStatus
          }
        }
        this.dataReady = true
      })
    }
    else {
      this.dataReady = true
    }
  }
  closeOnClick(ticker: string) {
    this.localStorageService.removeFromWatchlist(ticker.toUpperCase())
    this.watchlist = this.localStorageService.getAllWatchlist()
    this.tickerNamesArr = Object.keys(this.watchlist)
    delete this.tickerInfoObj[ticker]
    // update the data from api when any ticker is removed from wathlist
    // update only there are remaining tickers in watchlist
    if (this.tickerNamesArr.length > 0) {
      this.searchService.getLatestPrice(this.tickerNamesArr.toString()).subscribe(results => {
        var tmpChange: number, tmpChangeStatus: string
        for (let i = 0; i < results.length; i++) {
          tmpChange = results[i].last - results[i].prevClose
          if (tmpChange > 0) {
            tmpChangeStatus = 'POSITIVE'
          }
          else if (tmpChange == 0) {
            tmpChangeStatus = 'ZERO'
          }
          else {
            tmpChangeStatus = 'NEGATIVE'
          }
          this.tickerInfoObj[results[i].ticker] = {
            companyName: this.watchlist[results[i].ticker],
            last: results[i].last,
            change: tmpChange,
            changePercent: (tmpChange * 100 / results[i].prevClose),
            changeStatus: tmpChangeStatus
          }
        }
      })
    }
  }
}
