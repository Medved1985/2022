import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';

import { ExternalTaskStatusPossibleListRequest, ExternalTaskStatusPossibleListRes,
  } from '@api/SittelleServiceClient_pb';

import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { StatusSett } from '@api/SittelleTypeTask_pb';



@Injectable({
  providedIn: 'root'
})
export class ClientTaskService {
  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService, ) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  public TaskStatusPossibleList(taskInd: number) {
     
    const req = new ExternalTaskStatusPossibleListRequest();
    
    req.setTaskInd(taskInd);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskStatusPossibleList(req, null,
        (err: grpcWeb.Error, response: ExternalTaskStatusPossibleListRes) => {

        if (err) {
          console.log('request', req)
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.statusListList);
      });
    });
  }

  public TaskStatusPossibleListPromise(taskInd: number): Promise< Array<StatusSett.AsObject>> {
     
    const req = new ExternalTaskStatusPossibleListRequest();
    
    req.setTaskInd(taskInd);
    return new Promise((resolve, reject) => {
      this.ClientServiceClient.externalTaskStatusPossibleList(req, null,
        (err: grpcWeb.Error, response: ExternalTaskStatusPossibleListRes) => {

        if (err) {
          console.log('request', req)
          this.authService.errorHandler(err);
          reject([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        resolve(data.statusListList);
      });
    });
  }

}
