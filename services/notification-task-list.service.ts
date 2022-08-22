import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import {ExternalNotificationTaskListRequest, ExternalNotificationTaskListRes} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import { Observable } from 'rxjs';
import { StatusListService } from '@projectApp/services/status-list.service';
import { EnumTaskAction } from '@api/SittelleConst_pb';
import { formatDistanceToNow } from 'date-fns';
import * as ruLocaleDateFNS from 'date-fns/locale/ru';

@Injectable({
  providedIn: 'root'
})
export class NotificationTaskListService {

  private readonly ClientServiceClient: ClientServiceClient;
  private statusList = null;


  constructor(private Grpc: GrpcService, private authService: AuthService, private statusListService: StatusListService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }

    this.statusListService.get().subscribe(data => {
      // console.log(data);
      this.statusList = data;
    });
  }

  public get() {
    const req = new ExternalNotificationTaskListRequest();
    const sess = this.authService.getSess();
    req.setBufferAction(2);

    return new Observable(observer => {
      this.ClientServiceClient.externalNotificationTaskList(req, null, (err: grpcWeb.Error, response: ExternalNotificationTaskListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        const result = [];

        data.notificationListList.forEach(e => {
          result.push({
            actionType: e.notify.actionType,
            descriptionType: this.getDescription(e.notify.actionType),
            user: {
              ind: e.notify.accountApply.accountPerson.personInd,
              first_name: e.notify.accountApply.accountPerson.name || '',
              last_name: e.notify.accountApply.accountPerson.surname || ''
            },
            task: {
              ind: e.notify.taskSett.content.taskInd,
              caption: e.notify.taskSett.content.caption
            },
            status: this.statusList[e.notify.taskSett.status.statusInd].caption,
            date: formatDistanceToNow(new Date(e.notify.applyDate)) + ' назад'
          });
        });

        observer.next(result);
      });
    });
  }

  getDescription(actionType) {
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
        result = 'изменил ITEM';
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
}
