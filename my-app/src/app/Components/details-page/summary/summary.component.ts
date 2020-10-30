import { Component, OnInit, Input} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input('latestPrice') latestPrice: any
  @Input('companyDescription') companyDescription: any
  @Input('changeStatus') changeStatus: string
  @Input('dailyData') dailyData: any
  @Input('isMarketOpen') isMarketOpen: boolean


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options
  constructorType: string = 'stockChart'
  
  priceData = []

  interval: any

  constructor() { }

  ngOnInit(): void {
    // chart data
    this.updateDailyData()
    // refresh
    this.interval = setInterval(() => {
      this.updateDailyData()
    }, 15000)
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private updateDailyData(): void {
    var dateObj: Date
    var lineColor: string
    if (this.changeStatus === "POSITIVE") {
      lineColor = 'rgb(0, 140, 0)'
    }
    else if (this.changeStatus === "ZERO") {
      lineColor = '#000000'
    }
    else {
      lineColor = '#FF0000'
    }
    for (let i = 0; i < this.dailyData.length; i++) {
      dateObj = new Date(this.dailyData[i].date)
      this.priceData[i] = [dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000), this.dailyData[i].close]
    }
    this.chartOptions = {
      title: {
        text: this.companyDescription.ticker,  
      },
      rangeSelector: {
        enabled: false
      },
      navigator: {
        series: {
          type: 'area',
          fillColor: lineColor
        }
      },
      series: [{
        name: this.companyDescription.ticker,
        data: this.priceData,
        type: 'line',
        getExtremesFromAll: true,
        showInNavigator: true,
        tooltip: {
          valueDecimals: 2
        },
        threshold: null,
        color: lineColor
      }],
    }
  }

}
