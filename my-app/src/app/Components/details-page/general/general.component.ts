import { Component, OnInit, Input } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

}
