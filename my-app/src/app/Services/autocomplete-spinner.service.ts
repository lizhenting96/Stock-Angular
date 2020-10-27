import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
 
  visibility: boolean
  visibilityChange: Subject<boolean> = new Subject<boolean>()
 
  constructor() {
    this.visibility = false
  }
 
  show() {
    this.visibility = true
    this.visibilityChange.next(this.visibility)
  }
 
  hide() {
    this.visibility = false
    this.visibilityChange.next(this.visibility)
  }
}