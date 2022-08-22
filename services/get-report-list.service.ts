import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {ReportClient} from "@api/SittelleServiceReportServiceClientPb";
import {Observable} from 'rxjs';
import {ReportListRequest, ReportListRes} from "@api/SittelleServiceReport_pb";

@Injectable({
  providedIn: 'root'
})
export class GetReportListService {

  private readonly ReportServiceClient: ReportClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ReportServiceClient) {
      this.ReportServiceClient = Grpc.ReportServiceClient;
    }
  }

  get() {
    const sess = this.authService.getSess();
    const req = new ReportListRequest();
     

    return new Observable(observer => {
      this.ReportServiceClient.getReportList(req, null, (err: grpcWeb.Error, response: ReportListRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        observer.next(data.listList);
      })
    });
  }
}
