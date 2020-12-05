import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  descriptionUrl: string = 'https://kmjt00nm75.execute-api.us-east-1.amazonaws.com/dev/api/getdescription'
  latestpriceUrl: string = 'https://kmjt00nm75.execute-api.us-east-1.amazonaws.com/dev/api/getlatestprice'
  dailyDataUrl: string = 'https://kmjt00nm75.execute-api.us-east-1.amazonaws.com/dev/api/getdaily'
  historyUrl: string = 'https://kmjt00nm75.execute-api.us-east-1.amazonaws.com/dev/api/gethistory'
  newsUrl: string = 'https://kmjt00nm75.execute-api.us-east-1.amazonaws.com/dev/api/getnews'
  
  // descriptionUrl: string = '/api/getdescription'
  // latestpriceUrl: string = '/api/getlatestprice'
  // dailyDataUrl: string = '/api/getdaily'
  // historyUrl: string = '/api/gethistory'
  // newsUrl: string = '/api/getnews'
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
