import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../Services/search.service'
import { AutocompleteService } from '../../Services/autocomplete.service'
import { FormControl, FormGroup } from '@angular/forms';
import { SpinnerService } from '../../Services/autocomplete-spinner.service'



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  ticker: string = ''
  showSpinner: boolean
  form = new FormGroup(
    { ticker: new FormControl() }
  )
  filteredOptions: any[];

  constructor(private searchService: SearchService,
    private autoCompleteService: AutocompleteService,
    private spinnerService: SpinnerService) {
    this.showSpinner = spinnerService.visibility
    spinnerService.visibilityChange.subscribe(value => this.showSpinner = value)
  }

  onSubmit(): void {
    this.searchService.onSearch(this.ticker)
  }
  ngOnInit(): void {
    this.form.get("ticker").valueChanges.subscribe(input => {
      this.ticker = input
      this.filteredOptions = []
      setTimeout(() => {
        // console.log(this.form.get("ticker"))
        if (this.form.get("ticker").value == input) {
          this.filteredOptions = []
          if (this.form.get("ticker").value) {
            this.autoCompleteService.getSuggestions(input).subscribe(result => {
              this.filteredOptions = result
              this.spinnerService.hide()
              // console.log(this.showSpinner)
            })
          }
        }
      }, 1000)
    })
  }

}
