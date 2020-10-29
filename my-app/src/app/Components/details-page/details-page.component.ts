import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../../Services/search.service'


@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  tickerUrlParam: string
  // data for company description
  companyDescription: any
  // data for latest price
  latestPrice: any
  lastPrice: string
  change: string
  changePercent: string
  curTimeStamp: string
  dataTimeStamp: string
  // data for daily chart
  dataDate: string
  dailyData: any[]
  // data for historical chart
  hisctoricalData: any[]
  // data for news
  newsData: any[]
  // control
  changeStatus: string
  isMarketOpen: boolean = false
  tickerNotExists: boolean = false
  // test
  interval: any

  constructor(private route: ActivatedRoute, private searchService: SearchService,) {
    this.tickerUrlParam = this.route.snapshot.params.ticker
  }

  ngOnInit(): void {
    this.initializeAll()
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private initializeAll(): void {
    // get company description when initializing
    this.searchService.getDescription(this.tickerUrlParam).subscribe(result => {
      this.companyDescription = result
      // handle ticker not exists
      if (this.companyDescription.detail == "Not found.") {
        this.tickerNotExists = true
        this.dailyData = []
        this.latestPrice = {}
        this.newsData = []
        this.hisctoricalData = []
      }
      else {
        // ticker exists
        this.tickerNotExists = false
        // get latest price when initializing
        this.searchService.getLatestPrice(this.tickerUrlParam).subscribe(results => {
          this.latestPrice = results[0]
          this.analyzeLatestPrice(results[0])
          // get daily data for chart in summary tab when initializing
          // since we need dataDate after analyzeLatestPrice, we can only put it here
          this.searchService.getDailyData(this.tickerUrlParam, this.dataDate).subscribe(results => {
            this.dailyData = results
          })
        })
        // get historical data when initializing
        this.searchService.getHistory(this.tickerUrlParam).subscribe(results => {
          this.hisctoricalData = results
        })
        this.searchService.getNews(this.tickerUrlParam).subscribe(results => {
          this.newsData = results.articles
        })
        // set refreshing
        // this.interval = setInterval(() => {
        //   this.updatePartial()
        // }, 15000)
      }
    })
  }

  private updatePartial(): void {
    // get company description
    this.searchService.getDescription(this.tickerUrlParam).subscribe(results => {
      this.companyDescription = results
      console.log("company description updated!")
    })
    // get latest price 
    this.searchService.getLatestPrice(this.tickerUrlParam).subscribe(results => {
      this.latestPrice = results[0]
      console.log("latest price updated!")
      this.analyzeLatestPrice(results[0])
      // get daily data for chart in summary tab
      // since we need dataDate after analyzeLatestPrice, we can only put it here
      this.searchService.getDailyData(this.tickerUrlParam, this.dataDate).subscribe(results => {
        this.dailyData = results
        console.log("daily data updated!")
      })
    })
  }

  private analyzeLatestPrice(latestPrice: any): void {
    this.lastPrice = latestPrice.last.toFixed(2)
    this.change = (latestPrice.last - latestPrice.prevClose).toFixed(2)
    this.changePercent = ((latestPrice.last - latestPrice.prevClose) * 100 / latestPrice.prevClose).toFixed(2)
    if (parseFloat(this.change) > 0) {
      this.changeStatus = "POSITIVE"
    }
    else if (parseFloat(this.change) < 0) {
      this.changeStatus = "NEGATIVE"
    }
    else {
      this.changeStatus = "ZERO"
    }
    let curTime = new Date()
    let dataTime = new Date(latestPrice.timestamp)
    this.curTimeStamp = `${(new Intl.DateTimeFormat('fr-ca', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(curTime))}\ 
    ${(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(curTime))}`
    this.dataTimeStamp = `${(new Intl.DateTimeFormat('fr-ca', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(dataTime))}\ 
    ${(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(dataTime))}`
    this.dataDate = `${(new Intl.DateTimeFormat('fr-ca', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(dataTime))}`
    if (Math.floor((curTime.getTime() - dataTime.getTime()) / 1000) < 60) {
      this.isMarketOpen = true
    }
  }
}
