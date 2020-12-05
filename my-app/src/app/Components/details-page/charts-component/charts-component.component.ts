import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from 'highcharts/indicators/volume-by-price';

if (typeof Highcharts === 'object') {
    IndicatorsCore(Highcharts);
    vbp(Highcharts);
}

@Component({
  selector: 'app-charts-component',
  templateUrl: './charts-component.component.html',
  styleUrls: ['./charts-component.component.css']
})
export class ChartsComponentComponent implements OnInit {

  @Input('hisctoricalData') hisctoricalData: any[]
  @Input('ticker') ticker: string

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options
  constructorType: string = 'stockChart'

  constructor() { }

  ngOnInit(): void {
    // initialize chart data
    this.ticker = this.ticker.toUpperCase()
    var ohlc = [], volume = [], dataLength = this.hisctoricalData.length
    var tmpTimeStamp: number
    for(let i = 0; i < dataLength; i++) {
      tmpTimeStamp = new Date(this.hisctoricalData[i].date).getTime()
      ohlc.push([
        tmpTimeStamp, // the date
        this.hisctoricalData[i].open, // open
        this.hisctoricalData[i].high, // high
        this.hisctoricalData[i].low, // low
        this.hisctoricalData[i].close, // close
      ]);
      volume.push([
        tmpTimeStamp,
        this.hisctoricalData[i].volume
      ])
    }
    // initialize chart
    this.chartOptions = {
      rangeSelector: {
        selected: 2
    },
    title: {
        text: `${this.ticker} Historical`
    },
    subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
    },
    yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
            enabled: true
        }
    }, {
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
    }],
    tooltip: {
        split: true
    },
    plotOptions: {
        series: {
            dataGrouping: {
                units: [['day', [1]], ['week', [1]], ['month', [1]]],
                groupPixelWidth: 15
            }
        }
    },

    series: [{
        type: 'candlestick',
        name: this.ticker,
        id: this.ticker.toLowerCase(),
        zIndex: 2,
        data: ohlc
    }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
    }, {
        type: 'vbp',
        linkedTo: this.ticker.toLowerCase(),
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
    }, {
        type: 'sma',
        linkedTo: this.ticker.toLowerCase(),
        zIndex: 1,
        marker: {
            enabled: false
        }
    }]
    }
  }


  
}
