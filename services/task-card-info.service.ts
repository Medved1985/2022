import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { ExternalTaskCardInfoRequest, ExternalTaskCardInfoRes } from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { MonObjectEmployeeListRequest, MonObjectEmployeeListRes } from '@api/SittelleServiceDictionary_pb';
import { DictionaryClient } from '@api/SittelleServiceDictionaryServiceClientPb';
import { numberToBitArray } from '@projectApp/common/common-types';
import { EnumSystemConst} from '@api/SittelleConst_pb'
import { TTaskCardInfo, TTaskRole, TAccountGroupInRole} from '@projectApp/common/common-types'

@Injectable({
  providedIn: 'root'
})
export class TaskCardInfoService {

  private readonly ClientServiceClient: ClientServiceClient;
  private readonly DictionaryClient: DictionaryClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }

    if (!this.DictionaryClient) {
      this.DictionaryClient = Grpc.DictionaryServiceClient;
    }
  }

  public get(id)  {
     
    const req = new ExternalTaskCardInfoRequest();
    
    req.setTaskInd(id);
    // debugger;

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskCardInfo(req, null, (err: grpcWeb.Error, response: ExternalTaskCardInfoRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next(err);
          return;
        }

        const data = response.toObject();
        // console.log("taskType",data);
        // const monObject = this.monObject.find(item => item.ind === data.task.item.monObjectInd);
        const statusList = [];
        if (data.statusChangePossibleListList.length > 0) {
          statusList.push({groupName: 'Изменить статус на:', items: this.getStatusPossibleList(data.statusChangePossibleListList)});
        }
        if (data.statusCreatePossibleListList.length > 0) {
          statusList.push({groupName: 'Создать', items: this.getStatusPossibleList(data.statusCreatePossibleListList)});
        }

        const result: TTaskCardInfo = {
          rootTypeInd: data.task.item.rootTaskTypeInd,
          // templateGroupInd: data.task.item.ind,
          taskTypeAccount: data.task.sessionAccountState,
          taskTypeCommon: data.task.state.state,
          ind: data.task.item.ind,
          caption: data.task.content.caption,
          typeInd: data.task.item.taskTypeInd,
          content: data.task.content.content,
          status: data.task.status.statusInd,
          roleList: this.getRoleList(data.task.roleSettList),
          userRight: data.rights,
          manual: data.task.manual.paramListList,
          statusPossibleList: statusList, // this.getStatusPossibleList(data.statusPossibleListList),
          monObjectInd: data.task.item.monObjectInd,
          priority: data.task.content.priority,
          dateStart: new Date(data.task.dateStart),
          dateApply: new Date(data.task.status.dateApply),
          datePlanningStart: data.task.content.datePlanningStart ? new Date(data.task.content.datePlanningStart): null,
          datePlanningEnd: data.task.content.datePlanningEnd ? new Date(data.task.content.datePlanningEnd): null,
          timeEstimate: data.task.content.timeEstimate,
          history: this.getHistory(data),
          comment: {
            text: data.task.status.text,
            comment: data.task.status.comment
          },
          statusTemplatePossibleList: data.statusTemplatePossibleListList
        };
        observer.next(result);
      });
    });
  }

  public MonObjectEmployeeList(MonObjectInd) {
     
    const req = new MonObjectEmployeeListRequest();
    
    req.setMonObjectInd(MonObjectInd);
    // debugger;
    return new Observable(observer => {
      this.DictionaryClient.monObjectEmployeeList(req, null, (err: grpcWeb.Error, response: MonObjectEmployeeListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log('сотрудн',data);
        observer.next(data.employeeListList);
      });
    });
  }

  public getRight(rights, constRight) {
    return (rights & (1 << Number(constRight))) !== 0;
  }

  private getStatusPossibleList(data) {
    const result = [];
    data.forEach(e => {
      result.push({
        label: e.captionAction,
        value: e.ind
      });
    });
    return result;
  }

  private getHistory(data) {
    const result = [];
    // console.log(data.taskStatusListList);
    let writeValue = { prevStatus: EnumSystemConst.TASK_STATUS_EMPTY}
    data.taskStatusListList.forEach(e => {
      writeValue.prevStatus = e.statusInd
      writeValue = {
        ...e,
        prevStatus: EnumSystemConst.TASK_STATUS_EMPTY,
        type: 'taskStatus'
      }
      result.push(writeValue);
      // writeValue.prevStatus = e.statusInd
    });
    data.commentListList.forEach(e => {
      result.push({
        ...e,
        type: 'commentList'
      });
    });
    data.roleActionListList.forEach(e => {
      result.push({
        ...e,
        type: 'roleActionList'
      });
    });
    let prevState = 0
    let itemNumber = 0
    // console.log(data.stateListList)
    for (let index = data.stateListList.length-2; index >= 0; index--) {
      result.push({
        ...data.stateListList[index],
        addBits: numberToBitArray((prevState | data.stateListList[index].state ) ^ prevState),
        removeBits: numberToBitArray((prevState | data.stateListList[index].state ) ^ data.stateListList[index].state),
        type: 'stateList'
      });
      prevState = data.stateListList[index].state
    }
    // data.stateListList.forEach(e => {
    //     // skip first record
    //     if (itemNumber !== 0) {
    //       result.push({
    //         ...e,
    //         addBits: numberToBitArray((prevState | e.state ) ^ prevState),
    //         removeBits: numberToBitArray((prevState | e.state ) ^ e.state),
    //         type: 'stateList'
    //       });
    //     }
    //     prevState = e.state
    //     itemNumber++
    // });
    // console.log(data.accountStateListList)
    const map = new Map();
    data.accountStateListList.forEach(e => {
      prevState = map.has(e.accountInd)? map.get(e.accountInd): 0
      result.push({
        ...e,
        addBits: numberToBitArray((prevState | e.state ) ^ prevState),
        removeBits: numberToBitArray((prevState | e.state ) ^ e.state),
        type: 'accountStateList'
      });
      map.set(e.accountInd, e.state)
    });
    // console.log(map)
    itemNumber = 0
    data.contentListList.forEach(e => {
      if (itemNumber !== 0) {
        result.push({
          ...e,
          type: 'contentList'
        });
      }
      itemNumber++
    });

    return result.sort((d, p) => d.dateApply > p.dateApply ? 1 : d.dateApply < p.dateApply ? -1 : 0);
  }

  private getRoleList(data): TTaskRole[]{
    // console.log('getRoleList', data)
    const result = [];
    let i = 1;

    data.forEach(e => {
      const apply: TAccountGroupInRole[] = [];
      const possible: TAccountGroupInRole[] = [];

      // if (e.accountGroupListApplyList.length === 0 && e.accountGroupListPossibleList.length === 0) {
      //   return;
      // }

      e.accountGroupListApplyList.forEach(a => {
        apply.push({
          id: a.ind,
          caption: a.caption
        });
      });

      e.accountGroupListPossibleList.forEach(p => {
        possible.push({
          id: p.ind,
          caption: p.caption
        });
      });

      result.push({
        id: 'r' + i,
        ind: e.role.ind,
        name: (e.role.captionRegion)? e.role.captionRegion: e.role.caption,
        applyList: apply,
        possibleList: possible
      });
      i++;
    });
    // console.log('getRoleList', result)
    return result;
  }
}
