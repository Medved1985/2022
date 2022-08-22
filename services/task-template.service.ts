import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import {ExternalTaskTemplateListByMonObjectRequest, ExternalTaskTemplateListByMonObjectRes
  , ExternalTaskTemplateGroupListByMonObjectRequest, ExternalTaskTemplateGroupListByMonObjectRes
  , ExternalTaskTemplateGroupItemListRequest, ExternalTaskTemplateGroupItemListRes
  , ExternalTaskTemplateGroupItemAddRequest, ExternalTaskTemplateGroupItemAddRes
  , ExternalTaskTemplateGroupItemRemoveRequest, ExternalTaskTemplateGroupItemRemoveRes
  , ExternalTaskTemplateGroupAddRequest, ExternalTaskTemplateGroupAddRes
  , ExternalTaskTemplateGroupRemoveRequest, ExternalTaskTemplateGroupRemoveRes
  , ExternalTaskTemplateGroupSetRequest, ExternalTaskTemplateGroupSetRes
  } from '@api/SittelleServiceClient_pb';
import {TaskTemplateGroup} from '@api/SittelleTypeTask_pb'
import * as sittelleConst from '@api/SittelleConst_pb'



@Injectable({
  providedIn: 'root'
})
export class TaskTemplateService {

  private readonly ClientServiceClient: ClientServiceClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
     this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }
  public templateLisByMonObject(monObjectInd: number) {
     
    const req = new ExternalTaskTemplateListByMonObjectRequest();
     
    req.setMonObjectInd(monObjectInd);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateListByMonObject(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateListByMonObjectRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.inputListList);
      });
    });
  }
  // get template group list by monObject
  public templateGroupLisByMonObject(monObjectInd: number) {
     
    const req = new ExternalTaskTemplateGroupListByMonObjectRequest();
     
    req.setMonObjectInd(monObjectInd);
    req.setStatusPathInd(sittelleConst.EnumStatusPath.STATUS_PATH_AUTOINSPECTION_ADD);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupListByMonObject(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupListByMonObjectRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.templateGroupListList);
      });
    });
  }
  public templateItemLisByGroupInd(groupInd: number) {
     
    const req = new ExternalTaskTemplateGroupItemListRequest();
     
    req.setTemplateGroupInd(groupInd);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupItemList(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupItemListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.itemListList);
      });
    });
  }

  templateGroupFromObject(value: TaskTemplateGroup.AsObject): TaskTemplateGroup {
    const res = new TaskTemplateGroup();
    res.setInd(value.ind);
    res.setMonObjectInd(value.monObjectInd);
    res.setCaption(value.caption);
    res.setStatusInd(value.statusInd);
    res.setStatusPathInd(value.statusPathInd);
    return res;
  }

  public GroupAutoInspectionAdd(value: TaskTemplateGroup.AsObject){
     
    const req = new ExternalTaskTemplateGroupAddRequest();
     
    value.statusPathInd = sittelleConst.EnumStatusPath.STATUS_PATH_AUTOINSPECTION_ADD;
    req.setTemplateGroup(this.templateGroupFromObject(value));
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupAdd(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupAddRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public GroupRemove(itemList: number[]){
     
    const req = new ExternalTaskTemplateGroupRemoveRequest();
     
    req.setIndListList(itemList);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupRemove(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupRemoveRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public GroupAutoInspectionSet(value: TaskTemplateGroup.AsObject){
     
    const req = new ExternalTaskTemplateGroupSetRequest();
     
    req.setTemplateGroup(this.templateGroupFromObject(value));
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupSet(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupSetRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public templateItemAddToGroup(groupInd: number, itemList: number[]) {
     
    const req = new ExternalTaskTemplateGroupItemAddRequest();
     
    req.setTemplateGroupInd(groupInd);
    req.setItemListList(itemList);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupItemAdd(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupItemAddRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }
  public templateItemRemoveFromGroup(groupInd: number, itemList: number[]) {
     
    const req = new ExternalTaskTemplateGroupItemRemoveRequest();
     
    req.setTemplateGroupInd(groupInd);
    req.setItemListList(itemList);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskTemplateGroupItemRemove(req, null,
        (err: grpcWeb.Error, response: ExternalTaskTemplateGroupItemRemoveRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

}
