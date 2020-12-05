import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../Services/local-storage.service'
import { SearchService } from '../../Services/search.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-portfolio-page',
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit {

  // Card data
  portfolio: any
  tickerNamesArr: string[] = []
  tickerInfoObj: any
  dataReady: boolean = false
  // Buy modal
  buyQuantity: number
  // Sell modal
  sellQuantity: number

  constructor(
    private localStorageService: LocalStorageService,
    private searchService: SearchService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.updateData()
  }
  // update data
  updateData(): void {
    this.portfolio = this.localStorageService.getAllPortfolio()
    this.tickerNamesArr = Object.keys(this.portfolio)
    if (this.tickerNamesArr.length > 0) {
      this.searchService.getLatestPrice(this.tickerNamesArr.toString()).subscribe(results => {

        var tmpChange: number, tmpChangeStatus: string, tmpAvg: number, tmpCurrentPrice: number
        this.tickerInfoObj = {}
        for (let i = 0; i < results.length; i++) {
          tmpCurrentPrice = results[i].last
          tmpAvg = parseFloat((this.portfolio[results[i].ticker].totalCost / this.portfolio[results[i].ticker].totalShare).toFixed(2))
          tmpChange = tmpCurrentPrice - tmpAvg
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
            companyName: this.portfolio[results[i].ticker].companyName,
            quantity: (this.portfolio[results[i].ticker].totalShare),
            totalCost: (this.portfolio[results[i].ticker].totalCost).toFixed(2),
            avgPerShare: (tmpAvg).toFixed(2),
            currentPrice: tmpCurrentPrice.toFixed(2),
            change: tmpChange.toFixed(2),
            changeStatus: tmpChangeStatus,
            marketValue: (tmpCurrentPrice * this.portfolio[results[i].ticker].totalShare).toFixed(2)
          }
        }
        this.dataReady = true
      })
    }
    else {
      this.dataReady = true
    }
  }

  // Buy Modal Methods
  buyOpen(content: any) {
    this.buyQuantity = 0
    this.modalService.open(content)
  }
  isBuyQuantityCorrect(quantity: number): boolean {
    var qStr = quantity.toString()
    return quantity > 0 && /^\d+$/.test(qStr);
  }
  buyCalculateTotal(quantity: number, price: string) {
    if (!quantity || !this.isBuyQuantityCorrect(quantity)) {
      return '0.00'
    }
    return (quantity * parseFloat(price)).toFixed(2)
  }
  buyOnClick(ticker: string, companyName: string, price: string): void {
    var buyTotal = this.buyQuantity * parseFloat(price)
    this.localStorageService.addToPortfolio(ticker, this.buyQuantity, buyTotal, companyName)
    this.modalService.dismissAll()
    this.updateData()
  }

  // Sell Modal Methods
  sellOpen(content: any) {
    this.sellQuantity = 0
    this.modalService.open(content)
  }
  isSellQuantityCorrect(quantity: number, maxQuantity: number): boolean {
    var qStr = quantity.toString()
    return quantity <= maxQuantity && quantity > 0 && /^\d+$/.test(qStr);
  }
  sellCalculateTotal(quantity: number, price: string, maxQuantity: number) {
    if (!quantity || !this.isSellQuantityCorrect(quantity, maxQuantity)) {
      return '0.00'
    }
    return (quantity * parseFloat(price)).toFixed(2)
  }
  sellOnClick(ticker: string, price: string): void {
    var sellTotal = this.sellQuantity * parseFloat(price)
    this.localStorageService.minusFromPortfolio(ticker, this.sellQuantity, sellTotal)
    this.modalService.dismissAll()
    this.updateData()
  }
}
