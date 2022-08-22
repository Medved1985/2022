import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { ExternalTaskListByFilterRequest, ExternalTaskListByFilterRes } from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { TaskRequestFilter, TaskSett, TaskManual } from '@api/SittelleTypeTask_pb';
import { TaskTreeNodeInterface } from '../interfaces/task-tree-node-interface';
import { StatusListService } from './status-list.service';
import { MonObjectListService } from './mon-object-list.service';
import { EnumStatsAggregate } from '@api/SittelleConst_pb';
import { ManualValue } from '@api/SittelleTypeManual_pb';
import { SystemService } from '@projectApp/services/system/system.service';


@Injectable({
  providedIn: 'root'
})
export class TaskListByFilterService {

  private readonly ClientServiceClient: ClientServiceClient;


  private aggregate = EnumStatsAggregate;

  constructor(private Grpc: GrpcService, private authService: AuthService, private statusList: StatusListService,
    private systemService: SystemService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }



  get(searchArray): any {
    const taskRequestFilter = new TaskRequestFilter();
    if (searchArray.apply_mask) taskRequestFilter.setApplyMask(searchArray.apply_mask);
    if (searchArray.parent_task_ind_list) taskRequestFilter.setParentTaskIndList(searchArray.parent_task_ind_list);
    if (searchArray.task_ind_list) taskRequestFilter.setTaskIndList(searchArray.task_ind_list);
    // if (searchArray.source_list) taskRequestFilter.setSourceListList(searchArray.source_list);
    if (searchArray.mon_object_list) taskRequestFilter.setMonObjectListList(searchArray.mon_object_list.split(','));
    if (searchArray.status_list) taskRequestFilter.setStatusListList(searchArray.status_list.split(','));
    if (searchArray.content_caption_list) taskRequestFilter.setContentCaptionListList(searchArray.content_caption_list.split(' '));
    if (searchArray.task_type_list) taskRequestFilter.setTaskTypeListList(searchArray.task_type_list.split(','));
    if (searchArray.contract_list) taskRequestFilter.setContractListList(searchArray.contract_list.split(','));
    if (searchArray.company_list) taskRequestFilter.setCompanyListList(searchArray.company_list.split(','));
    if (searchArray.manual_list) taskRequestFilter.setManualParamListList(searchArray.manual_list.split(','));


    const req = new ExternalTaskListByFilterRequest();

    req.setFilter(taskRequestFilter);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskListByFilter(req, null, (err: grpcWeb.Error, response: ExternalTaskListByFilterRes) => {
        // console.log(response.toObject(), err);

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
            aggregateList[el.ind] = { value: el.valueStats };
          });

          // tslint:disable-next-line:max-line-length
          const aggregateStatus = (aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX] && aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX].value > 0) ?
            aggregateList[this.aggregate.STATS_AGGREGATE_PRIORITY_STATUS_MAX].value : e.status.statusInd;

          const d: TaskTreeNodeInterface = {
            key: e.item.ind,
            name: e.content.caption,
            id: e.item.ind,
            manual: e.manual.paramListList,
            expand: false,
            monObject: {
              ind: e.item.monObjectInd,
              caption: this.systemService.monObjectListMap[e.item.monObjectInd].caption || ''
            },
            firstDate: this.checkDate(aggregateList[this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MIN], e.dateStart),
            changeDate: this.checkDate(aggregateList[this.aggregate.STATS_AGGREGATE_DATE_CHANGE_MIN], e.status.dateApply),
            status: (!this.systemService.statusListMap[aggregateStatus].isGroup) ?
              this.systemService.statusListMap[aggregateStatus].captionStatus : '',
            statusColor: (!this.systemService.statusListMap[aggregateStatus].isGroup) ?
              this.systemService.statusColorGet(aggregateStatus) : '#fff',
            executor: this.getExecutor(e.roleSettList),
            isGroup: false, // (e.item.childIndListList.length > 0),
            statsStatusList: e.statistic.statsStatusListList,
            statsAggregateList: aggregateList,
            commonValue: e.state.state,
            accountValue: e.sessionAccountState,
            statistic: e.statistic,
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
          e.accountGroupListApplyList.forEach(ex => {
            executors.push({ id: ex.ind, caption: ex.caption });
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
