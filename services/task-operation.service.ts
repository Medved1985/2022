import { Injectable } from '@angular/core';

import {ExternalTaskCommentAddRequest,
  ExternalTaskCommentAddRes,
  ExternalTaskRemoveRequest, ExternalTaskRemoveRes,
  ExternalTaskParentChangeRequest, ExternalTaskParentChangeRes
} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import {Observable} from 'rxjs';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import {TaskComment} from '@api/SittelleTypeTask_pb';
import {EnumTextFromat} from '@api/SittelleConst_pb';

@Injectable({
  providedIn: 'root'
})
export class TaskOperationService {

  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  CommentAdd(taskInd: number, taskComment: string) {
     
    const req = new ExternalTaskCommentAddRequest();
    const comment = new TaskComment();

    comment.setTextFormat(EnumTextFromat.TEXT_FORMAT_HTML);
    comment.setTaskInd(taskInd);
    comment.setText(taskComment);

     
    req.setTaskComment(comment);
    req.setTaskInd(taskInd);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskCommentAdd(req, null, (err: grpcWeb.Error, response: ExternalTaskCommentAddRes) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data);
      });
    });
  }

  public TaskRemove(taskIndList: number[]){
     
    const req = new ExternalTaskRemoveRequest();
     
    req.setTaskListList(taskIndList);
    req.setIncludeChild(true);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskRemove(req, null, (err: grpcWeb.Error, response: ExternalTaskRemoveRes) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.changeTaskListList);
      });
    });
  }



  ParentChange(parentInd = 1, taskIndList) {
     
    const req = new ExternalTaskParentChangeRequest();
     
    req.setParentTaskInd(parentInd);
    req.setChildTaskIndListList(taskIndList);
    // debugger;

    this.ClientServiceClient.externalTaskParentChange(req, null, (err: grpcWeb.Error, response: ExternalTaskParentChangeRes) => {

      if (err) {
        this.authService.errorHandler(err);
        // observer.next([]);
        return;
      }

      console.log(response.toObject());

    });
  }
}
