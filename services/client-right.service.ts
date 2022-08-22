import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpcWeb from 'grpc-web';

import { ExternalTaskRightByIndRequest, ExternalTaskRightByIndRes,
  ExternalTaskRightByTypeAndStatusRequest, ExternalTaskRightByTypeAndStatusRes,
  } from '@api/SittelleServiceClient_pb';
import { Observable } from 'rxjs';

import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';

@Injectable({
  providedIn: 'root'
})
export class ClientRightService {
  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService, ) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  public TaskRightByTypeAndStatusRequest(rootTaskTypeInd, taskTypeInd, taskStatusInd, taskMonObjectInd: number) {
     
    const req = new ExternalTaskRightByTypeAndStatusRequest();
   
    req.setRootTaskType(rootTaskTypeInd);
    req.setTaskType(taskTypeInd);
    req.setStatusInd(taskStatusInd);
    req.setMonObjectInd(taskMonObjectInd);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskRightByTypeAndStatus(req, null,
        (err: grpcWeb.Error, response: ExternalTaskRightByTypeAndStatusRes) => {

        if (err) {
          console.log('request', req)
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.right);
      });
    });
  }
  public TaskRightByInd(taskList: Array<number>) {
     
    const req = new ExternalTaskRightByIndRequest();
    
    req.setTaskIndList(taskList);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskRightByInd(req, null,
        (err: grpcWeb.Error, response: ExternalTaskRightByIndRes) => {

        if (err) {
          console.log('request', req)
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.rightList);
      });
    });
  }
}


