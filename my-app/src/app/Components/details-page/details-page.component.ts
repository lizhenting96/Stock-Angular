import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SearchService } from '../../Services/search.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../Services/local-storage.service'
import { Subject } from 'rxjs';


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
  // buy modal
  buyQuantity: number
  popBuyEvent: Subject<void> = new Subject<void>();
  // control
  changeStatus: string
  isMarketOpen: boolean = false
  tickerNotExists: boolean = false
  // refresh
  interval: any

  constructor(
    private route: ActivatedRoute, 
    private searchService: SearchService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService) {
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
  
  // Data Fetching Methods
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
          // set refreshing when market is open
          if (this.isMarketOpen) {
            this.interval = setInterval(() => {
              this.updatePartial()
            }, 15000)
          }
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
        
      }
    })
  }

  private updatePartial(): void {
    // get company description
    this.searchService.getDescription(this.tickerUrlParam).subscribe(results => {
      this.companyDescription = results
    })
    // get latest price 
    this.searchService.getLatestPrice(this.tickerUrlParam).subscribe(results => {
      this.latestPrice = results[0]
      this.analyzeLatestPrice(results[0])
      // get daily data for chart in summary tab
      // since we need dataDate after analyzeLatestPrice, we can only put it here
      this.searchService.getDailyData(this.tickerUrlParam, this.dataDate).subscribe(results => {
        this.dailyData = results
      })
    })
    // console.log("data updated!")
  }

  private analyzeLatestPrice(latestPrice: any): void {
    this.lastPrice = latestPrice.last
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

  // Buy Modal Methods
  isQuantityCorrect(quantity: number): boolean {
    var qStr = quantity.toString()
    return quantity > 0 && /^\d+$/.test(qStr);
  }
  calculateTotal(quantity: number) {
    
    if (!quantity || !this.isQuantityCorrect(quantity)) {
      return '0.00'
    }
    return (quantity * parseFloat(this.lastPrice))
  }
  open(content: any) {
    this.buyQuantity = 0
    this.modalService.open(content)
  }
  buyOnClick(): void {
    var buyTotal = this.buyQuantity * parseFloat(this.lastPrice)
    this.localStorageService.addToPortfolio(this.companyDescription.ticker, this.buyQuantity, buyTotal, this.companyDescription.name)
    this.modalService.dismissAll()
    this.popBuyEvent.next();
  }
}
