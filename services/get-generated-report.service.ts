import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {ReportClient} from "@api/SittelleServiceReportServiceClientPb";
import {Observable} from 'rxjs';
import {GeneratedReportRequest, GeneratedReportRes} from "@api/SittelleServiceReport_pb";
import {ManualValue} from "@api/SittelleTypeManual_pb";
import {NzModalService, NzModalRef} from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class GetGeneratedReportService {

  private readonly ReportServiceClient: ReportClient;

  constructor(private Grpc: GrpcService, private authService: AuthService, private modalService: NzModalService) {
    if (!this.ReportServiceClient) {
      this.ReportServiceClient = Grpc.ReportServiceClient;
    }
  }

  getOptions() {
    return {
      deadline: new Date().setSeconds(new Date().getSeconds() + 5)
    }
  }

  get(reportInd, data, timeoutInSec: number) {
    const paramList = [];
    data.forEach(e => {
      const param = new ManualValue();
      // let value = (e.paramType === 2 && e.valueDf != 0) ? Math.floor(e.valueDf.getTime() / 1000) * 1000 : e.valueDf;
      const value = e.valueDf;
      param.setParamInd(e.ind);
      param.setValue(value.toString());
      paramList.push(param);
    });

    const sess = this.authService.getSess();
    const req = new GeneratedReportRequest();

    req.setReportInd(reportInd);
    req.setParamListList(paramList);
    req.setGenerateTimeout(timeoutInSec * 1000);
    // console.log(req.toObject());



    return new Observable(observer => {
      // const metadata = {'deadline': (new Date().getSeconds()+5).toString()};
      // const timeoutInSeconds = 1
      // const timeout = new Date().setSeconds(new Date().getSeconds() + timeoutInSeconds)
      // const metadata = {'deadline': timeout.toString()};
      // let metadata: any
      // metadata['grpc-timeout'] = '10000';
      this.ReportServiceClient.getGeneratedReport(req, null,  (err: grpcWeb.Error, response: GeneratedReportRes) => {

        if (err) {
          if (err.code === 2 && err.message === 'context deadline exceeded'){
            this.modalService.error({
              nzMask: false,
              nzClosable: false,
              nzTitle: `Ошибка`,
              nzContent: `Превышено время ожидания данных от сервера`,
              nzOnOk: () => {  }
            });
          } else {
            this.authService.errorHandler(err);
          }
          observer.next(err);
          return;
        }

        const res = response.toObject();
        observer.next(res);

      });
    });
  }
}
