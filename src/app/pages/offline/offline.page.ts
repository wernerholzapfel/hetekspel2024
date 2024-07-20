import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})
export class OfflinePage implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
