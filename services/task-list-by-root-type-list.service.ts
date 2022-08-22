import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import {ExternalPanelTaskListRequest, ExternalPanelTaskListRes} from '@api/SittelleServiceClient_pb';

import {ExternalPanelRootTaskListRequest, ExternalPanelRootTaskListRes,
  ExternalMonObjectListByRootTypeRequest, ExternalMonObjectListByRootTypeRes} from '@api/SittelleServiceClient_pb';

import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { TaskTreeNodeInterface } from '../interfaces/task-tree-node-interface';
import { StatusListService } from './status-list.service';
import { MonObjectListService } from './mon-object-list.service';
import {Error} from 'tslint/lib/error';
import { EnumStatsAggregate, EnumTaskSustemRole } from '@api/SittelleConst_pb';
import { TaskStatusTemplatePossibleService } from './task-status-template-possible.service';
import { SystemService} from '@projectApp/services/system/system.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListByRootTypeListService {
  private readonly ClientServiceClient: ClientServiceClient;
  private taskStatusList = null;
  private aggregate = EnumStatsAggregate;

  constructor(private Grpc: GrpcService, private authService: AuthService, private statusList: StatusListService,
              private monObjectList: MonObjectListService, private taskStatusTemplatePossibleService: TaskStatusTemplatePossibleService,
              private systemService: SystemService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
    statusList.get().subscribe(taskStatusList => {
      // console.log(taskStatusList);
      this.taskStatusList = taskStatusList;
    });
    this.taskStatusTemplatePossibleService.get();
  }

  MonObjectListByTypeList(rootTaskTypeInd, taskTypeInd: number){
    const sess = this.authService.getSess();
    // const req = new ExternalTaskListByRootTypeListRequest();
    // const req = new ExternalPanelTaskListRequest();
    const req = new ExternalMonObjectListByRootTypeRequest();


    // req.setParentTaskInd(parent);
    // req.setRootTypeListList(rootType);
    req.setRootTaskType(rootTaskTypeInd);
    req.setTaskType(taskTypeInd);

    return new Observable(observer => {
      const call = this.ClientServiceClient.externalMonObjectListByRootType(req, null,
        (err: grpcWeb.Error, response: ExternalMonObjectListByRootTypeRes) => {
          // console.log('TaskListByRootTypeList', response.toObject(), err);

          if (err) {
            console.log('request param',  req.toObject());
            this.authService.errorHandler(err);
            observer.next([]);
            return;
          }
          const data = response.toObject();
          observer.next(data.monObjectListList);
      });
      call.on('error', (err: Error) => {
        console.log(err);
      });
    });
  }

  get(panelInd: number, parent: number = 1): any {

    // const req = new ExternalTaskListByRootTypeListRequest();
    // const req = new ExternalPanelTaskListRequest();
    const req = new ExternalPanelRootTaskListRequest();


    // req.setParentTaskInd(parent);
    // req.setRootTypeListList(rootType);
    req.setPanelInd(panelInd);

    return new Observable(observer => {
      const call = this.ClientServiceClient.externalPanelRootTaskList(req, null,
        (err: grpcWeb.Error, response: ExternalPanelTaskListRes) => {
          // console.log('TaskListByRootTypeList', response.toObject(), err);

          if (err) {
            this.authService.errorHandler(err);
            observer.next([]);
            return;
          }

          const data = response.toObject();
          const result = [];
          data.taskListList.forEach((e) => {

            const aggregateList = [];
            e.statistic.statsAggregateListList.forEach(el => {
              aggregateList[el.ind] = {value: el.valueStats};
            });

            // tslint:disable-next-line:max-line-length
            const aggregateStatus = (aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX] && aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX].value > 0) ?
              aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX].value : e.status.statusInd;

            const d: TaskTreeNodeInterface = {
              key: e.item.ind,
              name: e.content.caption,
              id: e.item.ind,
              expand: false,
              monObject: {
                ind: e.item.monObjectInd,
                caption: this.systemService.monObjectListMap[e.item.monObjectInd].caption
              },
              firstDate: this.checkDate(aggregateList[this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MIN], e.dateStart),
              changeDate: this.checkDate(aggregateList[this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MIN], e.status.dateApply),
              status: (!this.taskStatusList[aggregateStatus].isGroup) ? this.taskStatusList[aggregateStatus].caption : '',
              statusColor: (!this.taskStatusList[aggregateStatus].isGroup) ? this.taskStatusList[aggregateStatus].colorBackground : '#fff',
              executor: this.getExecutor(e.roleSettList),
              isGroup: (e.item.childIndListList.length > 0),
              statsStatusList: e.statistic.statsStatusListList,
              statsAggregateList: aggregateList,
              commonValue: e.state.state,
              accountValue: e.sessionAccountState,
              statistic: e.statistic,
              notConfirm: (e.statistic.statsStatusListList.length > 0) ?
              e.statistic.statsAggregateListList[1].valueStats - e.statistic.statsCommonStateCountList[8] : null,
              rootTypeInd: e.item.rootTaskTypeInd,
              taskTypeInd: e.item.taskTypeInd,
              statusInd: e.status.statusInd,
            };
            // console.log(e.roleList);
            result.push(d);
          });
          observer.next(result);
      });
      call.on('error', (err: Error) => {
        console.log(err);
      });
    });
  }

  private getExecutor(roleList): any {
    let result = [];
    if (roleList.length > 0) {
      const executors = [];
      roleList.forEach((e) => {
        if (e.role.ind === EnumTaskSustemRole.TASK_ROLE_PERFOMER) {
          e.accountGroupListApplyList.forEach(ex  => {
            executors.push({id: ex.ind, caption: ex.caption});
          });
        }
      });
      result = executors;
    }
    return result;
  }

  private checkDate(dateAggregate, dateD) {
    return (dateAggregate && dateAggregate.value > 0 && dateAggregate.value < 32503680000) ? new Date(dateAggregate.value) : dateD;
  }
}
