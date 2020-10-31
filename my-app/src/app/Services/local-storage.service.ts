import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Watchlist methods
  isInWatchlist(ticker: string): boolean {
    ticker = ticker.toUpperCase()
    var curWatchlist = localStorage.getItem("watchlist")
    if (curWatchlist) {
      var curWatchlistObj = JSON.parse(curWatchlist)
      if (ticker in curWatchlistObj) {
        return true
      }
    }
    return false
  }

  removeFromWatchlist(ticker: string): void {
    ticker = ticker.toUpperCase()
    var curWatchlistObj = JSON.parse(localStorage.getItem("watchlist"))
    delete curWatchlistObj[ticker]
    localStorage.setItem("watchlist", JSON.stringify(curWatchlistObj))
  }

  addToWatchlist(ticker: string, companyName: string): void {
    ticker = ticker.toUpperCase()
    var curWatchlist = localStorage.getItem("watchlist")
    var curWatchlistObj: any
    if (!curWatchlist) {
      curWatchlistObj = {}
    }
    else {
      curWatchlistObj = JSON.parse(curWatchlist)
    }
    curWatchlistObj[ticker] = companyName
    localStorage.setItem("watchlist", JSON.stringify(curWatchlistObj))
  }

  getAllWatchlist(): any {
    var curWatchlist = localStorage.getItem("watchlist")
    if (curWatchlist) {
      return JSON.parse(curWatchlist)
    }
    return {}
  }

  // Portfolio Methods
  isInPortfolio(ticker: string) {
    ticker = ticker.toUpperCase()
    var curPortfolio = localStorage.getItem("portfolio")
    if (curPortfolio) {
      var curPortfolioObj = JSON.parse(curPortfolio)
      if (ticker in curPortfolioObj) {
        return true
      }
    }
    return false
  }

  // removeFromPortfolio(ticker: string) {
  //   ticker = ticker.toUpperCase()
  //   var curPortfolioObj = JSON.parse(localStorage.getItem("portfolio"))
  //   delete curPortfolioObj[ticker]
  //   localStorage.setItem("portfolio", JSON.stringify(curPortfolioObj))
  // }

  addToPortfolio(ticker: string, newShare: number, newCost: number, companyName: string) {
    ticker = ticker.toUpperCase()
    var curPortfolio = localStorage.getItem("portfolio")
    var curPortfolioObj: any, tickerObj: any
    if (!curPortfolio) {
      curPortfolioObj = {}
    }
    else {
      curPortfolioObj = JSON.parse(curPortfolio)
    }
    if (ticker in curPortfolioObj) {
      tickerObj = curPortfolioObj[ticker]
      tickerObj.totalShare += newShare
      tickerObj.totalCost += newCost
    }
    else {
      tickerObj = {
        companyName: companyName,
        totalShare: newShare,
        totalCost: newCost
      }
    }
    curPortfolioObj[ticker] = tickerObj
    localStorage.setItem("portfolio", JSON.stringify(curPortfolioObj))
  }
  minusFromPortfolio(ticker: string, sellShare: number, sellTotal: number) {
    ticker = ticker.toUpperCase()
    var curPortfolio = localStorage.getItem("portfolio")
    var curPortfolioObj: any, tickerObj: any

    curPortfolioObj = JSON.parse(curPortfolio)

    
    tickerObj = curPortfolioObj[ticker]
    if (tickerObj.totalShare <= sellShare) {
      delete curPortfolioObj[ticker]
      localStorage.setItem("portfolio", JSON.stringify(curPortfolioObj))
    }
    else {
      tickerObj.totalShare -= sellShare
      tickerObj.totalCost -= sellTotal
      curPortfolioObj[ticker] = tickerObj
      localStorage.setItem("portfolio", JSON.stringify(curPortfolioObj))
    }
    
  }
  getAllPortfolio(): any {
    var curPortfolio = localStorage.getItem("portfolio")
    if (curPortfolio) {
      return JSON.parse(curPortfolio)
    }
    return {}
  }
}
