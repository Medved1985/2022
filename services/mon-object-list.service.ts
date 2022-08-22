import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {Observable} from 'rxjs';
import {DictMonObjectInfoListRequest, DictMonObjectListRequest,  DictMonObjectListRes} from '@api/SittelleServiceDictionary_pb';
import { EnumSystemConst, EnumSystemTaskStatus, EnumTaskType,  } from '@api/SittelleConst_pb';
import { ExternalTaskListByMonObjectAndTypeListRequest, ExternalTaskListByMonObjectAndTypeListRes } from '@api/SittelleServiceClient_pb';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';


@Injectable({
  providedIn: 'root'
})
export class MonObjectListService {

  TASK_PARENT_IGNORE = EnumSystemConst.TASK_PARENT_IGNORE
  STATUS_MONITORING_OBJECT_GROUP = EnumSystemTaskStatus.STATUS_MONITORING_OBJECT_GROUP

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = Grpc.DictionaryServiceClient;
    }

    if (!this.ClientService) {
      this.ClientService = Grpc.ClientServiceClient;
    }
  }

  private readonly DictionaryServiceClient: DictionaryClient;
  private readonly ClientService: ClientServiceClient;

  private items = [];

  public get() {
    const sess = this.authService.getSess();
    const req = new DictMonObjectInfoListRequest();


    return new Observable(observer => {
      if (this.items.length > 0) {
        observer.next(this.items);
        return;
      }
      this.DictionaryServiceClient.dictMonObjectList(req, null, (err: grpcWeb.Error, response: DictMonObjectListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next(err);
          return;
        }

        const data = response.toObject();
        // console.log("все объекты", data)
        // this.items = data.monObjectListList;
        // observer.next(data.monObjectListList);
        const result = [];
        data.monObjectListList.forEach(e => {
          if ((e.monObjectInd > 0 || e.monObjectInd === -1 || e.monObjectInd === -3)&& e.active){
            result.push({ind: e.monObjectInd, caption: e.caption, active: true});
          }
        });
        observer.next(result);
      });
    });
  }

  // public getMonListForConfig() {
  //   const sess = this.authService.getSess();
  //   const req = new DictMonObjectListRequest();


  //   return new Observable(observer => {
  //     if (this.items.length > 0) {
  //       observer.next(this.items);
  //       return;
  //     }
  //     this.DictionaryServiceClient.dictMonObjectList(req, null, (err: grpcWeb.Error, response: DictMonObjectListRes) => {
  //       // console.log(response.toObject(), err);
  //       if (err) {
  //         this.authService.errorHandler(err);
  //         observer.next([]);
  //         return;
  //       }
  //       const data = response.toObject();
  //       let monObjectList = data.monObjectListList;
  //       monObjectList = monObjectList.filter(actualMonList => actualMonList.active === true ||
  //         actualMonList.monObjectInd === EnumSystemConst.MONOBJECT_ALL_IND);
  //       observer.next(monObjectList);
  //     });
  //   });
  // }

  // public getMonList() {
  //   const sess = this.authService.getSess();
  //   const req = new DictMonObjectListRequest();


  //   return new Observable(observer => {
  //     if (this.items.length > 0) {
  //       observer.next(this.items);
  //       return;
  //     }
  //     this.DictionaryServiceClient.dictMonObjectList(req, null, (err: grpcWeb.Error, response: DictMonObjectListRes) => {
  //       // console.log(response.toObject(), err);
  //       if (err) {
  //         this.authService.errorHandler(err);
  //         observer.next([]);
  //         return;
  //       }
  //       const data = response.toObject();
  //       observer.next(data.monObjectListList);
  //     });
  //   });
  // }

  public gettaskList(monObjectInd: number) {

    const req = new ExternalTaskListByMonObjectAndTypeListRequest();

    req.setMonObjectListList([monObjectInd]);
    req.setParentTaskInd(this.TASK_PARENT_IGNORE);
    req.setStatusInd(this.STATUS_MONITORING_OBJECT_GROUP);
    req.setTaskTypeListList([EnumTaskType.TASK_TYPE_ALL]);

    return new Observable(observer => {
      if (this.items.length > 0) {
        observer.next(this.items);
        return;
      }
      this.ClientService.externalTaskListByMonObjectAndTypeList(req, null, (err: grpcWeb.Error,
        response: ExternalTaskListByMonObjectAndTypeListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // observer.next(data.taskListList);
        const result = [];
        data.taskListList.forEach(el => {
            const notconf = el.statistic.statsAggregateListList[1].valueStats - el.statistic.statsCommonStateCountList[8]
            result.push({
              item: el.item,
              content: el.content,
              status: el.status,
              manual: el.manual,
              state: el.state,
              roleSettList: el.roleSettList,
              roleInputList: el.roleInputList,
              sessionAccountState: el.sessionAccountState,
              accountApplyList: el.accountApplyList,
              clientInd: el.clientInd,
              dateStart: el.dateStart,
              statistic: el.statistic,
              assignedTaskListList: el.assignedTaskListList,
              notConfirm: el.statistic.statsAggregateListList[1].valueStats - el.statistic.statsCommonStateCountList[8],
              Confirm: el.statistic.statsAggregateListList[1].valueStats - notconf,
              Task: el.statistic.statsAggregateListList[1].valueStats
            });
        });
        observer.next(result);
      });
    });
  }

}
