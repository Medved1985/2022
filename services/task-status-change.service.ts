import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import {
  ExternalTaskCommonStateChangeRes,
  ExternalTaskStatusChangeRequest
} from '@api/SittelleServiceClient_pb';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';
import {
  StatusInputSett,
  TaskContentInput,
  TaskFieldsInputValues,
  TaskItemInput,
  TaskRoleInput,
  TaskStateInput, TaskStatusInput
} from '@api/SittelleTypeTask_pb';
import {ManualValue} from '@api/SittelleTypeManual_pb';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusChangeService {

  private readonly ClientServiceClient: ClientServiceClient;
  private data: any = [];
  private additionalFields: any = [];
  private isTemplate = false;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  public setData(data) {
    this.data = data;
  }

  public setAdditionalFields(data) {
    this.additionalFields = data;
    // console.log(data, this.data);
  }

  public setTemplate() {
    this.isTemplate = true;
  }


  public change(statusInd, taskInd) {

    const req = new ExternalTaskStatusChangeRequest();

    req.setTaskInd(taskInd);
    req.setStatusInd(statusInd);
    req.setInputListList(this.parseData());
    console.log(req.toObject());

    return new Observable(observer => {
      this.ClientServiceClient.externalTaskStatusChange(req, null, (err: grpcWeb.Error, response: ExternalTaskCommonStateChangeRes) => {

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

  private parseData() {
    const inputList = [];
    let data = [];
    if (this.isTemplate) {
      this.additionalFields.forEach(e => {
        this.data[e.id].valueList.item.monObjectInd = e.monObjectInd;
        this.data[e.id].valueList.content.priority = e.priority;
        this.data[e.id].valueList.content.datePlanningStart = (e.datePlanningStart) ? e.datePlanningStart.getTime() : 0;
        this.data[e.id].valueList.content.datePlanningEnd = (e.datePlanningEnd) ? e.datePlanningEnd.getTime() : 0;
        this.data[e.id].valueList.content.timeEstimate = e.timeEstimate;
        this.data[e.id].valueList.content.contentCaption = e.contentCaption;
        data.push(this.data[e.id]);
      });
    } else {
      data = this.data;
    }

    data.forEach(e => {
      const manualList = [];
      const roleList = [];

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
        const mc = this.additionalFields[0].manual.find(item => item.id === manual.ind);
        let caption = null;
        if (mc.valueList.length > 0) {
          caption = mc.valueList.find(item => item.value === mc.valueDefault);
        }

        const manualValue = new ManualValue();
        manualValue.setCaption(caption.caption || mc.valueDefault); // значения в тексте
        // manualValue.setParamCaption(manual.caption);
        manualValue.setParamInd(manual.ind);
        manualValue.setValue(mc.valueDefault); // значение в цифре

        manualList.push(manualValue);
      });

      e.valueList.roleList.forEach((role, i) => {
        const rc = this.additionalFields[0].role.find(item => item.id === 'r' + role.roleind);

        if (!rc) {
          return;
        }

        const taskRoleInput = new TaskRoleInput();
        taskRoleInput.setAccountGroupListList(rc.applyList);
        taskRoleInput.setReplacerule(role.replacerule);
        taskRoleInput.setRoleind(role.roleind);

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

      inputList.push(input);
    });
    return inputList;
  }
}
