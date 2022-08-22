import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {Observable} from 'rxjs';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import { DictStateAccountListRequest, DictStateAccountListRes, DictStateCommonListRequest, DictStateCommonListRes, DictStatusListRequest,
   DictStatusListRes } from '@api/SittelleServiceDictionary_pb';
import { ExternalTaskAccountStateApplyRequest, ExternalTaskAccountStateChangeRequest,
  ExternalTaskAccountStateChangeRes, ExternalTaskCommonStateApplyRequest, ExternalTaskCommonStateChangeRequest,
  ExternalTaskCommonStateChangeRes } from '@api/SittelleServiceClient_pb';
import { TaskByTaskIndRequest, TaskByTaskIndRes , TaskListByAccountGroupListRequest, TaskListByAccountGroupListRes } from '@api/SittelleServiceHistory_pb';
import { TaskRoleInput, TaskSett, TaskStateInput } from '@api/SittelleTypeTask_pb';
import { HistoryServiceClient } from '@api/SittelleServiceHistoryServiceClientPb';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import * as grpc_methods from './grpc.methods';
import * as SittelleTypeTask_pb from '@api/SittelleTypeTask_pb';
// import { taskByTaskInd } from '@api/SittelleServiceHistory_pb';

@Injectable({
  providedIn: 'root'
})
export class StatusListService {
  DictStateCommonListRes: any;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryClient) {
      this.DictionaryClient = Grpc.DictionaryServiceClient;
    }
    if (!this.HistoryServiceClient) {
      this.HistoryServiceClient = Grpc.HistoryServiceClient;
    }
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  private readonly DictionaryClient: DictionaryClient;
  private readonly HistoryServiceClient: HistoryServiceClient;
  private readonly ClientServiceClient: ClientServiceClient;

  private items = [];

  private static dec2hexString(dec) {
    return '#' + dec.toString(16).padStart(6, '0').toLowerCase();
  }

  public get() {
    const sess = this.authService.getSess();
    const req = new DictStatusListRequest();


    return new Observable(observer => {
      if (this.items.length) {
        observer.next(this.items);
        return;
      }
      this.DictionaryClient.dictStatusList(req, null, (err: grpcWeb.Error, response: DictStatusListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        // console.log(data);
        const result = [];
        data.statusListList.forEach(e => {
          result[e.ind] = {
            ind: e.ind,
            colorBackground: StatusListService.dec2hexString(e.colorBackground),
            caption: e.captionStatus,
            isGroup: e.isGroup,
            taskTypeInd: e.taskTypeInd
          };
        });

        observer.next(result);
      });
    });
  }

  public getCommonList() {
    const sess = this.authService.getSess();
    const req = new DictStateCommonListRequest();

    return new Observable(observer => {
      if (this.items.length) {
        observer.next(this.items);
        return;
      }
      this.DictionaryClient.dictStateCommonList(req, null, (err: grpcWeb.Error, response: DictStateCommonListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        data.stateBitListList.sort((a, b) => a.bitNumber - b.bitNumber);
        observer.next(data.stateBitListList);
      });
    });
  }

  public getAccountList() {
    const sess = this.authService.getSess();
    const req = new DictStateAccountListRequest();

    return new Observable(observer => {
      if (this.items.length) {
        observer.next(this.items);
        return;
      }
      this.DictionaryClient.dictStateAccountList(req, null, (err: grpcWeb.Error, response: DictStateAccountListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        data.stateBitListList.sort((a, b) => a.bitNumber - b.bitNumber);
        // console.log('list',data);
        observer.next(data.stateBitListList);
      });
    });
  }

  // private grpcTaskStateCommonFromObject(value: SittelleTypeTask_pb.TaskStateInput): TaskStateInput{
  //   const res = new TaskStateInput();
  //   res.setValue(grpc_methods.grpcInt64ValueObject(value));
  //   // res.setKpp(grpc_methods.grpcInt64ValueObject(value.kpp.value));
  //   // res.setOgrn(grpc_methods.grpcInt64ValueObject(value.ogrn.value));
  //   // res.setActive(grpc_methods.grpcBoolObject(value.active.value));
  //   // res.setRemovedata(grpc_methods.grpcInt64ValueObject(value.removedata.value));
  //   // res.setWebsite(value.website);
  //   return res;
  // }

  public getTaskStateCommonChange(taskInd, taskStateCommon: number , taskStateCommonMask: number ) {
    const sess = this.authService.getSess();
    const req = new ExternalTaskCommonStateApplyRequest();

    req.setTaskInd(taskInd);
    req.setStateMask(1 << taskStateCommon);
    req.setMaskApplyType(taskStateCommonMask);
    // let taskStateInputObj = new SittelleTypeTask_pb.TaskStateInput();
    // taskStateInputObj.setValue(taskStateCommon)
    // req.setTaskState(taskStateInputObj);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskCommonStateApply(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public getTaskStateAccountChange(taskInd, taskStateAccount: number , taskStateAccountMask: number ) {
    const sess = this.authService.getSess();
    const req = new ExternalTaskAccountStateApplyRequest();

    req.setTaskInd(taskInd);
    req.setStateMask(1 << taskStateAccount);
    req.setMaskApplyType(taskStateAccountMask);
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskAccountStateApply(req, null, (err: grpcWeb.Error, response: null) => {
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
