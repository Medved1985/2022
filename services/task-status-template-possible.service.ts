import { Injectable } from '@angular/core';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from "@api/SittelleServiceClientServiceClientPb";
import {Observable} from 'rxjs';
import {GrpcService} from "./grpc.service";
import {AuthService} from "./auth.service";
import {
  ExternalTaskStatusTemplatePossibleRequest,
  ExternalTaskStatusTemplatePossibleRes,
  ExternalTaskTemplateGroupListByTaskRequest,
  ExternalTaskTemplateGroupListByTaskRes,
  ExternalTaskTemplateGroupTaskAddRequest,
  ExternalTaskTemplateGroupTaskAddRes
} from "@api/SittelleServiceClient_pb";

@Injectable({
  providedIn: 'root'
})
export class TaskStatusTemplatePossibleService {

  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  public get(taskInd = 1) {
    const sess = this.authService.getSess();
    const req = new ExternalTaskStatusTemplatePossibleRequest();
     
    req.setTaskInd(taskInd);

    this.ClientServiceClient.externalTaskStatusTemplatePossible(req, null,
      (err: grpcWeb.Error, response: ExternalTaskStatusTemplatePossibleRes) => {
      // console.log(response.toObject(), err);
    });
  }

  public getPackage(taskInd: number) {
    const sess = this.authService.getSess();
    const req = new ExternalTaskTemplateGroupListByTaskRequest();
     
    req.setTaskInd(taskInd);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupListByTask(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupListByTaskRes) => {
        if (err) {
          console.log(req.toObject());
          console.log(err);
          this.authService.errorHandler(err);
          observer.next();
          return;
        }
        const data = response.toObject();
        observer.next(data.templateGroupListList);
        // console.log(data.templateGroupListList);
      });

    });

    // this.ClientServiceClient.externalTaskTemplateGroupListByTask(req, null, (err: grpcWeb.Error, response: ExternalTaskTemplateGroupListByTaskRes ) => {
    //   console.log(response.toObject(), err);
    // });
  }

  public addPackage(taskInd: number , templateGroupInd: number) {
    // console.log(taskInd, templateGroupInd);
    const sess = this.authService.getSess();
    const req = new ExternalTaskTemplateGroupTaskAddRequest();
     
    req.setTaskInd(taskInd);
    req.setTemplateGroupInd(templateGroupInd);
    // req.setSessionAccountGroupListList([]);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupTaskAdd(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupTaskAddRes) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next();
          return;
        }
        const data = response.toObject();
        observer.next(data.changeTaskListList);
        // console.log(data.changeTaskListList);
      });

    });
  }
}
