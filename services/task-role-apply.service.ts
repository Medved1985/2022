import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import {ExternalTaskRoleApplyRequest, ExternalTaskRoleApplyRes} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import {TaskRoleInput} from '@api/SittelleTypeTask_pb';

@Injectable({
  providedIn: 'root'
})
export class TaskRoleApplyService {

  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  change(taskInd, role) {
    
    const applyList = [];

    role.applyList.forEach(e => {
      applyList.push(e.id);
    });

    const taskRoleInput = new TaskRoleInput();
    taskRoleInput.setRoleind(role.ind);
    taskRoleInput.setAccountGroupListList(applyList);

    const req = new ExternalTaskRoleApplyRequest();
     
    req.setRole(taskRoleInput);
    req.setTaskInd(taskInd);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskRoleApply(req, null, (err: grpcWeb.Error, response: ExternalTaskRoleApplyRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        observer.next(data);
      });
    });
  }
}
