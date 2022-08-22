import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import {ExternalTaskManualChangeRequest, ExternalTaskManualChangeRes} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { ManualValue } from '@api/SittelleTypeManual_pb';

@Injectable({
  providedIn: 'root'
})
export class TaskManualChangeService {

  private readonly ClientServiceClient: ClientServiceClient;
  // private manualField = [];

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }


  public manualChange(taskInd: number, value: Array<ManualValue>) {


    const req = new ExternalTaskManualChangeRequest();

    req.setTaskInd(taskInd);
    req.setParamListList(value);
    // console.log(taskInd)
    // console.log(value)

    this.ClientServiceClient.externalTaskManualChange(req, null, (err: grpcWeb.Error, response: ExternalTaskManualChangeRes) => {
      console.log(response.toObject(), err);

      if (err) {
        this.authService.errorHandler(err);
        return;
      }
    });
  }



}
