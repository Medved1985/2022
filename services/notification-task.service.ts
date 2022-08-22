import { Injectable } from '@angular/core';

import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import {ClientAppInfoRequest, ClientAppInfoRes, ExternalNotificationTaskListRequest, ExternalNotificationTaskListRes,
  ExternalNotificationTaskProcessRequest, ExternalNotificationTaskProcessRes} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import {EnumStatsAggregate, EnumTaskAction, EnumNotificationAction} from '@api/SittelleConst_pb';
// import { distanceInWordsToNow } from 'date-fns';
// import * as ruLocaleDateFNS from 'date-fns/locale/ru';
import {TaskTreeNodeInterface} from '../interfaces/task-tree-node-interface';
import { StatusListService } from './status-list.service';
import {MonObjectListService} from './mon-object-list.service';
import {TaskChangeNotification} from '@api/SittelleTypeNotification_pb';
import * as grpc_methods from './grpc.methods';


@Injectable({
  providedIn: 'root'
})
export class NotificationTaskService {

  private readonly ClientServiceClient: ClientServiceClient;
  private statusList = null;
  private aggregate = EnumStatsAggregate;
  notificationTaskInd: number

  constructor(private Grpc: GrpcService, private authService: AuthService, private statusListService: StatusListService,    ) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
    if (this.authService.check()){

      this.statusListService.get().subscribe(data => {
        // console.log(data);
        this.statusList = data;
      });
    }
  }


  notificationTaskList(notificationInd: number){
    const req = new ExternalNotificationTaskListRequest();


    req.setNotificationInd(notificationInd);
    req.setBufferAction(1 << EnumNotificationAction.NOTIFICATION_ACTION_SEEN);
    return new Observable(observer => {
      this.ClientServiceClient.externalNotificationTaskList(req, null, (err: grpcWeb.Error,
        response: ExternalNotificationTaskListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          console.log(err);
          observer.next(err);
          return;
        }
        const data = response.toObject();
        observer.next(data);
      });
    });
  }

  notificationTaskProcess(action: EnumNotificationAction, indList: number[]){
    const req = new ExternalNotificationTaskProcessRequest();


    req.setNotifyAction(action);
    console.log(indList);
    req.setNotificationIndList(indList);
    console.log(req);
    return new Observable(observer => {
      this.ClientServiceClient.externalNotificationTaskProcess(req, null, (err: grpcWeb.Error,
        response: ExternalNotificationTaskProcessRes) => {
        if (err) {
          this.authService.errorHandler(err);
          // console.log(err);
          observer.next(err);
          return;
        }
        const data = response.toObject();
        observer.next(data);
      });
    });
  }

  // taskListPanel(){
  //   const req = new ExternalNotificationTaskListRequest();
  //
  //     req.setSessId(sess.sid);
  //     req.setConnectionInd(Number(sess.cid));
  //     req.setNotificationInd(this.notificationTaskInd);
  //     req.setBufferAction(1 << EnumNotificationAction.NOTIFICATION_ACTION_SEEN);
  //     return new Observable(observer => {
  //       this.ClientServiceClient.externalNotificationTaskList(req, null, (err: grpcWeb.Error,
  //         response: ExternalNotificationTaskListRes) => {

  //         if (err) {
  //           // this.authService.errorHandler(err);
  //           console.log(err);
  //           observer.next([]);
  //           return;
  //         }
  //         const data = response.toObject();
  //         this.notificationTaskInd = data.notificationInd;
  //         if (req.toObject().notificationInd !== 0) {
  //           observer.next(data.notificationListList);
  //         } else {
  //           const res: TaskChangeNotification.AsObject[] = []
  //           data.notificationListList.forEach(e =>{
  //             if ((e.processState & (1 << EnumNotificationAction.NOTIFICATION_ACTION_SEEN)) === 0){
  //               res.push(e)
  //             }
  //           });
  //           observer.next(res);
  //         }
  //       });
  //     });
  // }


  // taskListPanel1() []TaskChangeNotification.AsObject{
  //   const req = new ExternalNotificationTaskListRequest();
  //
  //     req.setSessId(sess.sid);
  //     req.setConnectionInd(Number(sess.cid));
  //     req.setNotificationInd(this.notificationTaskInd);
  //     req.setBufferAction(1 << EnumNotificationAction.NOTIFICATION_ACTION_PANEL);
  //     return new Observable(observer => {
  //       this.ClientServiceClient.externalNotificationTaskList(req, null, (err: grpcWeb.Error,
  //         response: ExternalNotificationTaskListRes) => {

  //         if (err) {
  //           // this.authService.errorHandler(err);
  //           console.log(err);
  //           observer.next([]);
  //           return;
  //         }

  //         const data = response.toObject();
  //         const result = [];
  //         this.notificationTaskInd = data.notificationInd;
  //         // console.log('taskListPanel', data);

  //         data.notificationListList.forEach(e => {
  //             if ((req.toObject().notificationInd !== 0) ||
  //               ((e.processState & (1 << EnumNotificationAction.NOTIFICATION_ACTION_PANEL)) === 0)){
  //             const task = e.taskSett;
  //             const monObject = [];
  //             this.monObjectList.forEach(m => {
  //               monObject[m.ind] = {id: m.id, caption: m.caption, address: m.address};
  //             });

  //             const aggregateList = [];
  //             task.statsAggregateListList.forEach(el => {
  //               aggregateList[el.ind] = {value: el.valueStats};
  //             });

  //             // tslint:disable-next-line:max-line-length
  //             const aggregateStatus = (aggregateList[this.aggregate.STATS_AGGREAGATE_PRIORITY_STATUS_MAX]
  // && aggregateList[this.aggregate.STATS_AGGREAGATE_PRIORITY_STATUS_MAX].value > 0) ?
  //               aggregateList[this.aggregate.STATS_AGGREAGATE_PRIORITY_STATUS_MAX].value : task.status.statusInd;

  //             const d: TaskTreeNodeInterface = {
  //               key: task.item.ind,
  //               name: task.content.caption,
  //               id: task.item.ind,
  //               expand: false,
  //               score: monObject[task.item.monObjectInd] || {id: null, caption: ''},
  //               firstDate: this.checkDate(aggregateList[this.aggregate.STATS_AGGREAGATE_DATE_CHANGE_MIN], task.dateStart),
  //               changeDate: this.checkDate(aggregateList[this.aggregate.STATS_AGGREAGATE_DATE_CHANGE_MIN], task.status.dateApply),
  //               status: (!this.statusList[aggregateStatus].isGroup) ? this.statusList[aggregateStatus].caption : '',
  //               statusColor: (!this.statusList[aggregateStatus].isGroup) ? this.statusList[aggregateStatus].colorBackground : '#fff',
  //               executor: this.getExecutor(task.roleSettList),
  //               isGroup: (task.item.childIndListList.length > 0),
  //               statsStatusList: task.statsStatusListList,
  //               statsAggregateList: aggregateList,
  //               parentInd: task.item.parentInd,
  //               panelList: e.panelListList
  //             };
  //             // console.log(e.roleList);
  //             result.push(d);
  //           }
  //         });
  //         observer.next(result);
  //       });
  //     });
  // }
  private getDescription(actionType) {
    let result = '';

    switch (actionType) {
      case EnumTaskAction.TASK_ACTION_CREATE :
        result = 'создал(-а) задачу';
        break;
      case EnumTaskAction.TASK_ACTION_STATUS_CHANGE :
        result = 'изменил статус задачи';
        break;
      case EnumTaskAction.TASK_ACTION_MANUAL_CHANGE :
        result = 'изменил мануальные поля';
        break;
      case EnumTaskAction.TASK_ACTION_ROLE_CHANGE :
        result = 'изменил роли';
        break;
      case EnumTaskAction.TASK_ACTION_CONTENT_CHANGE :
        result = 'изменил описание';
        break;
      case EnumTaskAction.TASK_ACTION_COMMENT_ADD :
        result = 'добавил комментарий';
        break;
      case EnumTaskAction.TASK_ACTION_STATE_CHANGE :
        result = 'изменил STATE';
        break;
      case EnumTaskAction.TASK_ACTION_ITEM_CHANGE :
        result = ' изменил ITEM';
        break;
      case EnumTaskAction.TASK_ACTION_PARENT_CHANGE :
        result = 'изменил родителя задачи';
        break;
      case EnumTaskAction.TASK_ACTION_STATUS_INPUT_CHANGE :
        result = 'изменил STATUS_INPUT';
        break;
      case EnumTaskAction.TASK_ACTION_LOST_ACCESS :
        result = 'LOST_ACCESS';
        break;
      case EnumTaskAction.TASK_ACTION_ACCOUNT_STATE_CHANGE :
        result = 'ACCOUNT_STATE_CHANGE';
        break;
      default:
        result = '';
    }
    return result;
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

  GetClientInfo() {

    const req = new ClientAppInfoRequest();

    return new Observable(observer => {
      this.ClientServiceClient.clientAppInfo(req, null, (err: grpcWeb.Error, response: ClientAppInfoRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.appInfoList);
      });
    });
  }

}


