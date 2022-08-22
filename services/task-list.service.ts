import {Injectable} from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import {ExternalTaskListRequest, ExternalTaskListRes} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import { TaskTreeNodeInterface } from '../interfaces/task-tree-node-interface';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import {Observable} from 'rxjs';
import { StatusListService } from './status-list.service';
import { MonObjectListService } from './mon-object-list.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private readonly ClientServiceClient: ClientServiceClient;
  private taskStatusList = null;
  private monObject = null;

  // tslint:disable-next-line:max-line-length
  constructor(private Grpc: GrpcService, private authService: AuthService, private statusList: StatusListService, private monObjectList: MonObjectListService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
    statusList.get().subscribe(taskStatusList => {
      // console.log(taskStatusList);
      this.taskStatusList = taskStatusList;
    });
    monObjectList.get().subscribe(monObject => {
      // console.log(monObject);
      this.monObject = monObject;
    });
  }



  public getData(): any {
    const sess = this.authService.getSess();
    const req = new ExternalTaskListRequest();
    req.setConnectionInd(Number(sess.cid));
    req.setSessId(sess.sid);
    req.setParentTaskInd(-1);

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskList(req, null, (err: grpcWeb.Error, response: ExternalTaskListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        const result = [];
        data.taskListList.map((e) => {
          const monObject = [];
          this.monObject.forEach(m => {
            monObject[m.ind] = {id: m.id, caption: m.caption, address: m.address};
          });
          const d: TaskTreeNodeInterface = {
            key: e.item.ind,
            name: e.content.caption,
            id: e.item.ind,
            expand: false,
            score: monObject[e.item.monObjectInd] || {id: null, caption: ''},
            firstDate: e.dateStart,
            changeDate: e.status.dateApply,
            status: (this.taskStatusList[e.status.statusInd]) ? this.taskStatusList[e.status.statusInd].caption : '',
            statusColor: (this.taskStatusList[e.status.statusInd]) ? this.taskStatusList[e.status.statusInd].colorBackground : '#fff',
            executor: [], // this.getExecutor(e.roleList),
            isGroup: (e.item.childIndListList.length > 0),
            children: e.item.childIndListList
          };
          // console.log(e.roleList);
          result.push(d);
        });
        observer.next(result);
      });
    });
    // call.on('status', (status: grpcWeb.Status) => {
    //   console.log(status);
    // });
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
}
