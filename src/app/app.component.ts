import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hash-messages-client';

  constructor(private http: HttpClient) {
    this.http.get('')
      .toPromise()
      .then(response => console.log(13, response));
  }
}
