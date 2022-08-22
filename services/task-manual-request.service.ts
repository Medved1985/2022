import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { TaskManualChangeService } from './task-manual-change.service';
import {ExternalTaskManualRequestRequest, ExternalTaskManualRequestRes} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { MonObjectShort } from '@api/SittelleTypeDictionary_pb'
import { EnumManualParamSystem } from '@api/SittelleConst_pb';
import { ManualListValue } from '@api/SittelleTypeManual_pb'
import * as CommonTypes from '@projectApp/common/common-types'

@Injectable({
  providedIn: 'root'
})
export class TaskManualRequestService {

  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  public get(statusInd, taskInd,  monObjectListPossible: Array<MonObjectShort.AsObject> = []) {
     
    const req = new ExternalTaskManualRequestRequest();
    
    req.setStatusInd(statusInd);
    req.setTaskInd(taskInd);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskManualRequest(req, null, (err: grpcWeb.Error, response: ExternalTaskManualRequestRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        CommonTypes.normalizeManualParameters(data.taskManualRequestList, monObjectListPossible)
        observer.next(data.taskManualRequestList);
      });
    });
  }
}
