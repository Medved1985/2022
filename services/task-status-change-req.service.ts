import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { TaskStatusChangeService } from './task-status-change.service';
import {
  ExternalTaskStatusChangeReqRequest, ExternalTaskStatusChangeReqRes,
  ExternalTaskStatusChangeRequest, ExternalTaskStatusChangeRes,
} from '@api/SittelleServiceClient_pb';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';
import { ExternalInputSett } from '@api/SittelleTypeClient_pb'
import {
  StatusInputSett,
  TaskContentInput,
  TaskFieldsInputValues,
  TaskItemInput,
  TaskRoleInput,
  TaskStateInput, TaskStatusInput
} from '@api/SittelleTypeTask_pb';
import { ManualValue } from '@api/SittelleTypeManual_pb';
import { MonObjectShort } from '@api/SittelleTypeDictionary_pb'
import { EnumManualParamSystem } from '@api/SittelleConst_pb';
import { ManualListValue } from '@api/SittelleTypeManual_pb'
import * as CommonTypes from '@projectApp/common/common-types';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusChangeReqService {

  private readonly ClientServiceClient: ClientServiceClient;
  // private inputFieldGroup = EnumInputFieldGroup;

  constructor(private Grpc: GrpcService, private authService: AuthService, private taskStatusChangeService: TaskStatusChangeService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  // change(statusInd, taskInd) {
  //   const sess = this.authService.getSess();
  //   const req = new ExternalTaskStatusChangeReqRequest();
  //   req.setConnectionInd(Number(sess.cid));
  //   req.setSessId(sess.sid);
  //   req.setStatusInd(statusInd);
  //   req.setTaskInd(taskInd);

  //   return new Observable(observer => {
  //     // this.ClientServiceClient.externalPanelFil
  //     this.ClientServiceClient.externalTaskStatusChangeReq(req, null, (err: grpcWeb.Error, response: ExternalTaskStatusChangeReqRes) => {
  //       // console.log(response, err);

  //       if (err) {
  //         this.authService.errorHandler(err);
  //         observer.next([]);
  //         return;
  //       }

  //       const data = response.toObject();
  //       console.log(data);
  //       // observer.next(data);
  //       if (data.changeTaskListList.length !== 0 && data.inputListList.length === 0) {
  //         observer.next(data);
  //       } else {
  //         this.taskStatusChangeService.setData(data.inputListList);
  //         const result = [];
  //         data.inputListList.forEach(e => {
  //           let i = 1;
  //           const item = {
  //             manual: [],
  //             role: []
  //           };
  //           if (this.getInputFieldGroup(e.fieldManual, this.inputFieldGroup.INPUT_FIELD_GROUP_MANUAL)) {
  //             e.manualRequestList.forEach((el) => {
  //               let value = null;
  //               let dependent = null;
  //               if (el.dependentListList.length > 0) {
  //                 value = [];
  //                 dependent = el.dependentListList;
  //               } else {
  //                 value = el.valueListList;
  //                 dependent = [];
  //               }
  //               item.manual.push({
  //                 id: el.ind,
  //                 type: el.paramType,
  //                 caption: el.caption,
  //                 valueList: value,
  //                 valueDefault: el.valueDf,
  //                 parentParam: el.parentParamListList,
  //                 dependentList: dependent
  //               });
  //             });
  //           }
  //           if (this.getInputFieldGroup(e.fieldManual, this.inputFieldGroup.INPUT_FIELD_GROUP_ROLE)) {
  //             e.roleRequestList.forEach(el => {
  //               const apply = [];
  //               const possible = [];

  //               if (el.accountGroupListApplyList.length === 0 && el.accountGroupListPossibleList.length === 0) {
  //                 return;
  //               }

  //               el.accountGroupListApplyList.forEach(a => {
  //                 apply.push(a.ind);
  //               });

  //               el.accountGroupListPossibleList.forEach(p => {
  //                 possible.push({
  //                   id: p.ind,
  //                   caption: p.caption
  //                 });
  //               });

  //               item.role.push({
  //                 id: 'r' + el.role.ind,
  //                 name: el.role.captionRegion,
  //                 applyList: apply,
  //                 possibleList: possible,
  //                 demand: el.demand
  //               });
  //               i++;
  //             });
  //           }
  //           result.push(item);
  //         });
  //         observer.next(result);
  //       }
  //     });
  //   });
  // }
  StatusChangeReq(statusInd, taskInd: number, monObjectListPossible: Array<MonObjectShort.AsObject> = []) {

    const req = new ExternalTaskStatusChangeReqRequest();

    req.setStatusInd(statusInd);
    req.setTaskInd(taskInd);

    return new Observable(observer => {
      // this.ClientServiceClient.externalPanelFil
      this.ClientServiceClient.externalTaskStatusChangeReq(req, null, (err: grpcWeb.Error, response: ExternalTaskStatusChangeReqRes) => {
        // console.log(response, err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        console.log(data);

        if (data.inputListList && data.inputListList.length === 0) {
        } else {
          if (monObjectListPossible.length > 0) {
            data.inputListList.forEach(input => {
              CommonTypes.normalizeManualParameters(input.manualRequestList, monObjectListPossible)
            });
          }
        }
        observer.next(data);
      });
    });
  }
  public StatusChange(statusInd: number, taskInd: number, inputList: ExternalInputSett.AsObject[]): any {


    const req = new ExternalTaskStatusChangeRequest();

    req.setTaskInd(taskInd);
    req.setStatusInd(statusInd);
    req.setInputListList(this.inputListAsObject(inputList));
    console.log(req.getInputListList());
    // console.log(this.constructor.name, 'StatusChange', req.toObject());
    return new Observable(observer => {
      this.ClientServiceClient.externalTaskStatusChange(req, null, (err: grpcWeb.Error, response: ExternalTaskStatusChangeRes) => {
        if (err) {
          console.log(req.toObject())
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        console.log(data);
        observer.next(data);
      });
    });
  }

  private inputListAsObject(inputList: ExternalInputSett.AsObject[]) {

    // console.log(this.constructor.name, 'StatusChange', inputList);

    const res: StatusInputSett[] = new Array()
    inputList.forEach(e => {
      const manualList: ManualValue[] = new Array();
      const roleList: TaskRoleInput[] = new Array();

      const taskContentInput = new TaskContentInput();
      taskContentInput.setActivePlanningEnd(e.valueList.content.activePlanningEnd);
      taskContentInput.setActivePlanningStart(e.valueList.content.activePlanningStart);
      taskContentInput.setContentCaption(e.valueList.content.contentCaption);
      taskContentInput.setContentContent(e.valueList.content.contentContent);
      taskContentInput.setDatePlanningEnd(e.valueList.content.datePlanningEnd);
      taskContentInput.setDatePlanningStart(e.valueList.content.datePlanningStart);
      taskContentInput.setMonObjectIndListList(e.valueList.content.monObjectIndListList);
      taskContentInput.setPriority(e.valueList.content.priority);
      taskContentInput.setTimeEstimate(e.valueList.content.timeEstimate);

      const taskItemInput = new TaskItemInput();
      taskItemInput.setMonObjectInd(e.valueList.item.monObjectInd);
      taskItemInput.setSourceId(e.valueList.item.sourceId);
      taskItemInput.setSourceInd(e.valueList.item.sourceInd);
      taskItemInput.setTableText(e.valueList.item.tableText);

      e.manualRequestList.forEach((manual, i) => {
        let caption = null;
        if (manual.valueListList.length > 0) {
          caption = manual.valueListList.find(item => item.value === manual.valueDf);
        }
        const manualValue = new ManualValue();
        if (caption) {
          manualValue.setCaption(caption.caption || manual.valueDf); // значения в тексте
        } else {
          manualValue.setCaption(manual.valueDf.toString()); // значения в тексте
        }
        // manualValue.setParamCaption(manual.caption);
        manualValue.setParamInd(manual.ind);
        manualValue.setValue(manual.valueDf.toString()); // значение в цифре
        manualList.push(manualValue);
      });

      e.roleRequestList.forEach((role, i) => {
        const taskRoleInput = new TaskRoleInput();
        const roleIndList: number[] = new Array();
        role.accountGroupListApplyList.forEach(element => {
          console.log(this.constructor.name, 'StatusChange', element);
          roleIndList.push(element.ind || Number(element))
        });
        // console.log(this.constructor.name, 'StatusChange', roleIndList);
        taskRoleInput.setAccountGroupListList(roleIndList);
        taskRoleInput.setReplacerule(0);
        taskRoleInput.setRoleind(role.role.ind);
        roleList.push(taskRoleInput);
      });

      const taskStateInput = new TaskStateInput();
      taskStateInput.setValue(e.valueList.state.value);

      const taskStatusInput = new TaskStatusInput();
      taskStatusInput.setChainId(e.valueList.status.chainId);
      taskStatusInput.setTimestamp(e.valueList.status.timestamp);
      taskStatusInput.setMessageId(e.valueList.status.messageId);
      taskStatusInput.setStatusComment(e.valueList.status.statusComment);
      taskStatusInput.setStatusText(e.valueList.status.statusText);

      const fieldsInputValues = new TaskFieldsInputValues();
      fieldsInputValues.setContent(taskContentInput);
      fieldsInputValues.setItem(taskItemInput);
      console.log(manualList);
      fieldsInputValues.setManualList(manualList);
      fieldsInputValues.setRoleList(roleList);
      fieldsInputValues.setState(taskStateInput);
      fieldsInputValues.setStatus(taskStatusInput);

      const input = new StatusInputSett();
      input.setValueList(fieldsInputValues);
      input.setFieldAuto(e.fieldAuto);
      input.setFieldManual(e.fieldManual);
      input.setStatusInd(e.statusInd);
      input.setSubtaskPathInd(e.subtaskPathInd);

      res.push(input);
    });
    return res;
  }
  private getInputFieldGroup(rights, constRight) {
    return (rights & (1 << Number(constRight))) !== 0;
  }
}
