import { Component, OnInit, Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Input('newsData') newsData: any[]

  publishedDate: string
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content)
  }

  convertDate(date: string): string {
    var dateObj = new Date(date)
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(dateObj)
  }

  getTwitterUrl(title: string, url: string): string {
    return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title)  + '%20' + encodeURIComponent(url)
  }
  getFacebookUrl(url: string): string {
    return "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)
  }
}
