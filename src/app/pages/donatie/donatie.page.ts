import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donatie',
  templateUrl: './donatie.page.html',
  styleUrls: ['./donatie.page.scss'],
})
export class DonatiePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.setItem('donatieGezien', 'true')
  }

  openHome() {
    this.router.navigate([`home`], {replaceUrl: false});
}
}
