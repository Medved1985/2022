import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { ExternalPanelTaskChildListRequest, ExternalPanelTaskChildListRes, ExternalTaskCommonStateApplyChildListRequest,
  ExternalTaskCommonStateApplyChildListResponse } from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { TaskTreeNodeInterface } from '../interfaces/task-tree-node-interface';
import { StatusListService } from './status-list.service';
import { EnumStatsAggregate } from '@api/SittelleConst_pb';
import { SystemService} from '@projectApp/services/system/system.service';

@Injectable({
  providedIn: 'root'
})
export class TaskChildListService {

  private readonly ClientServiceClient: ClientServiceClient;
  private taskStatusList = null;
  private aggregate = EnumStatsAggregate;

  constructor(private Grpc: GrpcService, private authService: AuthService, private statusList: StatusListService,
    private systemService: SystemService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
    statusList.get().subscribe(taskStatusList => {
      // console.log(taskStatusList);
      this.taskStatusList = taskStatusList;
    });
  }

  get(taskInd, panelInd): any {

    // const req = new ExternalTaskChildListRequest();
    const req = new ExternalPanelTaskChildListRequest();

    req.setTaskInd(taskInd);
    req.setPanelInd(panelInd);

    return new Observable(observer => {
      this.ClientServiceClient.externalPanelTaskChildList(req, null, (err: grpcWeb.Error, response: ExternalPanelTaskChildListRes) => {

        if (err) {
          console.log(req);
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        const result = [];
        // console.log(data.taskListList);

        data.taskListList.map((e) => {

          const aggregateList = [];
          e.statistic.statsAggregateListList.forEach(el => {
            aggregateList[el.ind] = {value: el.valueStats};
          });

          const aggregateStatus = ((aggregateList.length > this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX) &&
            (aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX] &&
            aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX].value > 0)) ?
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
            firstDate:  (aggregateList.length > this.aggregate.STATS_AGGREGATE_DATE_START_MIN) ?
              this.checkDate(aggregateList[this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MIN], e.dateStart):  e.dateStart,
            changeDate: (aggregateList.length > this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MAX) ?
              this.checkDate(aggregateList[this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MAX], e.status.dateApply): e.status.dateApply,
            status: ((this.taskStatusList.length > aggregateStatus) &&(!this.taskStatusList[aggregateStatus].isGroup)) ?
              this.taskStatusList[aggregateStatus].caption : '',
            statusColor: (this.taskStatusList[aggregateStatus]) ? this.taskStatusList[aggregateStatus].colorBackground : '#fff',
            executor: this.getExecutor(e.roleSettList),
            isGroup: (e.item.childIndListList.length > 0),
            statsStatusList: (e.statistic.statsStatusListList.length > 0)? e.statistic.statsStatusListList: new Array(),
            statsAggregateList: (aggregateList.length > 0)? aggregateList: new Array(),
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
    });
  }

  private getExecutor(roleList): any {
    let result = [];
    if (roleList.length > 0) {
      const executors = [];
      roleList.forEach((e) => {
        if (e.role.ind === 2) {
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

  TaskChildApply(taskInd, levelchild, maskApplyType, stateMask): any {

    const req = new ExternalTaskCommonStateApplyChildListRequest();

    req.setTaskInd(taskInd);
    req.setLevelchild(levelchild);
    req.setMaskApplyType(maskApplyType);
    req.setStateMask(stateMask);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskCommonStateApplyChildList(req, null,
        (err: grpcWeb.Error, response: ExternalTaskCommonStateApplyChildListResponse) => {

        if (err) {
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

}
