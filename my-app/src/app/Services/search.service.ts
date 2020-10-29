import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  descriptionUrl: string = 'http://localhost:8080/getdescription'
  latestpriceUrl: string = 'http://localhost:8080/getlatestprice'
  dailyDataUrl: string = 'http://localhost:8080/getdaily'
  historyUrl: string = 'http://localhost:8080/gethistory'
  newsUrl: string = 'http://localhost:8080/getnews'
  constructor(private router: Router, private http: HttpClient) { }

  onSearch(ticker: string) {
    this.router.navigate([`/details/${ticker}`])
  }

  getDescription(ticker: string): Observable<any> {
    return this.http.get(this.descriptionUrl + `/${ticker}`)
  }
  getLatestPrice(ticker: string): Observable<any> {
    return this.http.get(this.latestpriceUrl + `/${ticker}`)
  }
  getDailyData(ticker: string, date: string): Observable<any> {
    return this.http.get(this.dailyDataUrl + `/${ticker}/${date}`)
  }
  getHistory(ticker: string): Observable<any> {
    return this.http.get(this.historyUrl + `/${ticker}`)
  }
  getNews(ticker: string): Observable<any> {
    return this.http.get(this.newsUrl + `/${ticker}`)
  }
}
