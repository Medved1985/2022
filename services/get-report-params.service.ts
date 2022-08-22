import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {ReportClient} from '@api/SittelleServiceReportServiceClientPb';
import {Observable} from 'rxjs';
import {ReportAppInfoRequest, ReportAppInfoRes, ReportParamsRequest, ReportParamsRes}
  from '@api/SittelleServiceReport_pb';
import * as CommonTypes from '@projectApp/common/common-types';


@Injectable({
  providedIn: 'root'
})
export class GetReportParamsService {

  private readonly ReportServiceClient: ReportClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ReportServiceClient) {
      this.ReportServiceClient = Grpc.ReportServiceClient;
    }
  }

  get(reportInd) {
   
    const req = new ReportParamsRequest();
     
    req.setReportInd(reportInd);

    return new Observable(observer => {
      this.ReportServiceClient.getReportParams(req, null, (err: grpcWeb.Error, response: ReportParamsRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        CommonTypes.normalizeManualParameters(data.requestListList)
        // data.requestListList.map(el => {
        //   // @ts-ignore
        //   el.valueDf = (el.valueDf === -1) ? null : el.valueDf;
        // });
        observer.next(data.requestListList);
      });
    });
  }

  GetReportInfo() {
    const sess = this.authService.getSess();
    const req = new ReportAppInfoRequest();

    return new Observable(observer => {
      this.ReportServiceClient.reportAppInfo(req, null, (err: grpcWeb.Error, response: ReportAppInfoRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.appInfo);
      });
    });
  }

}
