import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestService } from '../services/http-request.service';

interface Country {
  name: string;
  flag: string;
  cases: string;
  recovered: string;
  deaths: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public isLoading: boolean = false;
  public countries: Country[] = [];

  constructor(private httpReq: HttpRequestService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.httpReq.get('insights').subscribe((res: any) => {
      if(res.status === 'success') {
        this.countries = res.data.countries;
      } else {
        this.toastr.error(res.message);
      }

      this.isLoading = false;
    })
  }

}
