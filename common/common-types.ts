
import { Account, DocumentKind, Person } from '@api/typeGeneral_pb';
import {
  EnumAuthorizationResult, EnumManualParamSystem,
  EnumEventSourceClass,
  EnumDataInputType,
  EnumTaskClass,
  EnumTaskStatus,
  EnumTaskSituation,
  EnumEventStatus,
  EnumEventClass,
  EnumEventTaskAssign,
  EnumReglamentPeriodicity,
  EnumReglamentActivationMode,
  EnumMeasureValueType
} from '@api/typeConst_pb';
import * as grpcWeb from 'grpc-web';
import * as SittelleTypeManual_pb from '@api/typeManual_pb';
import * as ThemeService from '@projectApp/theme/theme.service';
import { formatDate } from '@angular/common';
import * as jspb from 'google-protobuf';
import { ManualRequestValue } from '@api/typeManual_pb'
import { MonObjectShort } from '@projectApp/api/serviceTuner_pb';
import {
  EventSource, Event, EventCommentHistory, EventStatusHistory,
  EventTaskAssignHistory, EventKind, Task, TaskCommentHistory, TaskStatusHistory, Parameter, Reglament, Building
} from '@projectApp/api/typeClient_pb';
import { eventSituationList, eventStatusList, measureTypeList, reglamentActivationList, reglamentPeriodicityList,
   reglamentStatusRegList, taskStatusList, TDictionary } from './common-vars';
import { Document } from '@projectApp/api/typeGeneral_pb';
// import { Person } from '@projectApp/api/base/entity/entity_pb';

import { Person as ReportPerson } from '@projectApp/api/base/entity/entity_pb'; 


export type TSoftwareSettings = {
  Caption: string,
  WelcomeText: string,
  Logo: string,
  theme: ThemeService.ThemeType,
  rights: string,
  themeEnable: boolean,
}

export const maxDocumentFileSize = 1025 * 1024 * 60;

// record for authentication
export type TAuthRecord = {
  SessId: string;
  ConnectionInd: number;
  Remember: boolean;
  account?: Account.AsObject,
  authorizationType: EnumAuthorizationResult,
}

export type TEventSourceTree = {
  title: string,
  key: string,
  ind: number,
  isLeaf: boolean,
  children: Array<TEventSourceTree>,
  selectable?: boolean 
}

export type TEventKindTree = {
  title: string,
  key: string,
  ind: number,
  isLeaf: boolean,
  children: Array<TEventKindTree>,
  selectable?: boolean ,
}

export type TDocumentKindTree = {
  title: string,
  key: string,
  ind: number,
  isLeaf: boolean,
  children: Array<TEventKindTree>,
  selectable?: boolean ,
}

export type TDocumentTree = {
  title: string,
  key: string,
  ind: number,
  isLeaf: boolean,
  children: Array<TEventKindTree>,
}

export interface ManualValueExtend extends ManualRequestValue.AsObject {
  disabled: boolean
}

export type BuildingEventSourceGroup = {
  building: Building.AsObject,
  eventSourcesList: Array<EventSource.AsObject>,  
}

export interface TReglamentBuildingGrouped extends Reglament.AsObject {
  buildingGroupList: Array<BuildingEventSourceGroup>,
}

export type TItemHistory = {
  account: Account.AsObject,
  timestamp: number,
  action: string;
}

export function getTaskStatusPossible(task: Task.AsObject): TDictionary[] {
  let res: TDictionary[] = [];
  console.log(task)
  switch (task.status) {
    case EnumTaskStatus.TASK_STATUS_NOT_PROCESSED:
      res = [
        { caption: taskStatusAsString(EnumTaskStatus.TASK_STATUS_EXECUTE), id: EnumTaskStatus.TASK_STATUS_EXECUTE },
        { caption: taskStatusAsString(EnumTaskStatus.TASK_STATUS_CANCELLED), id: EnumTaskStatus.TASK_STATUS_CANCELLED },
      ];
      break;
    case EnumTaskStatus.TASK_STATUS_EXECUTE:
      if (!task.reglament || !task.reglament.measuretype || !task.parameter) {
        if (task.situation !== EnumTaskSituation.TASK_SITUATION_NOT_DETERMINED){
          res = [
            { caption: taskStatusAsString(EnumTaskStatus.TASK_STATUS_DONE), id: EnumTaskStatus.TASK_STATUS_DONE },
            { caption: taskStatusAsString(EnumTaskStatus.TASK_STATUS_CANCELLED), id: EnumTaskStatus.TASK_STATUS_CANCELLED },
          ];
        } else {
          res = [
            { caption: taskStatusAsString(EnumTaskStatus.TASK_STATUS_CANCELLED), id: EnumTaskStatus.TASK_STATUS_CANCELLED },
          ];
        }
      }
      break;
    default:
      break;
  }
  return res;
}
export function personAsString(person: Person.AsObject): string{
  if (person){
    return person.name + ' ' +   person.surname + ' ' + person.patronymic
  }
  return ''
}

export function personAsStringReport(person: ReportPerson.AsObject): string{
  if (person) {
    //@ts-ignore
    return person.name.value + ' ' +   person.surname.value + ' ' + person.patronymic.value
  }
  return ''
}

export function getTaskSituationPossible(task: Task.AsObject): TDictionary[] {
  let res: TDictionary[] = [];
  switch (task.situation) {
    case EnumTaskSituation.TASK_SITUATION_NOT_DETERMINED:
      res = [
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_NOT_HAZARD), id: EnumTaskSituation.TASK_SITUATION_NOT_HAZARD },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_HAZARD), id: EnumTaskSituation.TASK_SITUATION_HAZARD },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY),
          id: EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_ACCIDENT), id: EnumTaskSituation.TASK_SITUATION_ACCIDENT },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_EMERGENCY), id: EnumTaskSituation.TASK_SITUATION_EMERGENCY },
      ];
      break;
    case EnumTaskSituation.TASK_SITUATION_NOT_HAZARD:
      res = [
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_HAZARD), id: EnumTaskSituation.TASK_SITUATION_HAZARD },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY),
           id: EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_ACCIDENT),
          id: EnumTaskSituation.TASK_SITUATION_ACCIDENT },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_EMERGENCY), id: EnumTaskSituation.TASK_SITUATION_EMERGENCY },
      ];
      break;
      case EnumTaskSituation.TASK_SITUATION_HAZARD:
        res = [
          { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_NOT_HAZARD), id: EnumTaskSituation.TASK_SITUATION_NOT_HAZARD },
          { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY),
             id: EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY },
          { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_ACCIDENT),
            id: EnumTaskSituation.TASK_SITUATION_ACCIDENT },
          { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_EMERGENCY), id: EnumTaskSituation.TASK_SITUATION_EMERGENCY },
        ];
        break;
    case EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY:
      res = [
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_NOT_HAZARD), id: EnumTaskSituation.TASK_SITUATION_NOT_HAZARD },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_ACCIDENT),
          id: EnumTaskSituation.TASK_SITUATION_ACCIDENT },
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_EMERGENCY), id: EnumTaskSituation.TASK_SITUATION_EMERGENCY },
      ];
      break;
    case EnumTaskSituation.TASK_SITUATION_ACCIDENT:
      res = [
        { caption: taskSituationAsString(EnumTaskSituation.TASK_SITUATION_EMERGENCY), id: EnumTaskSituation.TASK_SITUATION_EMERGENCY },
      ];
      break;
    case EnumTaskSituation.TASK_SITUATION_EMERGENCY:
      res = [
      ];
      break;
    default:
      break;
  }
  return res;
}

export function getEventStatusPossible(event: Event.AsObject): TDictionary[] {
  let res: TDictionary[] = [];
  switch (event.status) {
    case EnumEventStatus.EVENT_STATUS_NOT_PROCESSED:
      res = [
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_OBSERVATION), id: EnumEventStatus.EVENT_STATUS_OBSERVATION },
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_PROCESSED), id: EnumEventStatus.EVENT_STATUS_PROCESSED },
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_ERRONEOUS), id: EnumEventStatus.EVENT_STATUS_ERRONEOUS },
      ];
      break;
    case EnumEventStatus.EVENT_STATUS_OBSERVATION:
      res = [
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_PROCESSED), id: EnumEventStatus.EVENT_STATUS_PROCESSED },
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_ERRONEOUS), id: EnumEventStatus.EVENT_STATUS_ERRONEOUS },
      ];
      break;
    case EnumEventStatus.EVENT_STATUS_ERRONEOUS:
      res = [
      ];
      break;
    case EnumEventStatus.EVENT_STATUS_LINKED:
      res = [
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_PROCESSED), id: EnumEventStatus.EVENT_STATUS_PROCESSED },
        { caption: eventStatusAsString(EnumEventStatus.EVENT_STATUS_ERRONEOUS), id: EnumEventStatus.EVENT_STATUS_ERRONEOUS },
      ];
      break;
    case EnumEventStatus.EVENT_STATUS_PROCESSED:
      res = [
      ];
      break;
    default:
      break;
  }
  return res;
}

export type TAccountGroupInRole = {
  id: number,
  caption: string
}

export type TTaskRole = {
  id: string,
  ind: number,
  name: string,
  applyList: TAccountGroupInRole[],
  possibleList: TAccountGroupInRole[]
}



export type TTaskPriority = {
  ind: number,
  caption: string,
}

export type TTemplateList = {
  label: string[],
  items: TTaskTemplate[],
}

export type TTaskTemplate = {
  id: number,
  disabled: boolean,
  monObjectInd: number,
  priority: number
  datePlanningStart: Date,
  datePlanningEnd: Date,
  datePlanningStartApply: Date,
  datePlanningEndApply: Date,
  timeEstimate: number,
  contentCaption: string,
  manual: any,
  role: any,
}



export type TMonObjectInfo = {
  monObjectInd: number,
  caption: string,
  isSystem: boolean,
  number: number,
  premesisType: string,
  openDate: number,
  unitType: string,
  salesarea: number,
  totalarea: number,
  region: string,
  company: string,
  phone: string,
  address: string,
  email: string,
  contract: any,
  contactor: any,
  contactList: any,
  companyList: any,
}

export type TPanelTaskRight = {
  rootTypeInd: number;
  taskTypeInd: number;
  statusInd: number;
  Right: number;
}

export const CONST_CONNECTION_ERROR = 2;
export const CONST_AUTHENTICATION_ERROR = 16;
export const CONST_PERMISSION_DENIED_ERROR = 7;
export const CONST_NOT_FOUND = 5;

export function isConnectError(error): boolean {
  if ((error as grpcWeb.RpcError).code) {
    // debugger;
    if ((((error as grpcWeb.RpcError).code === CONST_CONNECTION_ERROR) && ((error as grpcWeb.RpcError).message === 'Http response at 400 or 500 level'))
      || ((error as grpcWeb.RpcError).code === 14)) {
      return true;
    }
  }
  return false;
}
export function clone(obj) {
  if (null == obj || 'object' !== typeof obj) return obj;
  const copy = obj.constructor();
  for (const attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

export function getManualParam(manual: Array<SittelleTypeManual_pb.ManualValue.AsObject>, paramInd: number):
  SittelleTypeManual_pb.ManualValue.AsObject {
  for (let index = 0; index < manual.length; index++) {
    if (manual[index].paramInd === paramInd) {
      return manual[index]
    }
  }
  return null
}

export function eventCommentToHistory(comment: EventCommentHistory.AsObject): string {
  return ' добавил комментарий: ' + comment.comment;
}

export function taskCommentToHistory(comment: TaskCommentHistory.AsObject): string {
  return ' добавил комментарий: ' + comment.comment;
}

export function eventStatusToHistory(value: EventStatusHistory.AsObject): string {
  return ' изменил статус на: ' + eventStatusAsString(value.status);
}

export function taskStatusToHistory(value: TaskStatusHistory.AsObject): string {
  return ' изменил статус на: ' + taskStatusAsString(value.status);
}

export function eventAssignActionToHistory(value: EventTaskAssignHistory.AsObject): string {
  switch (value.action) {
    case EnumEventTaskAssign.TASK_EVENT_ASSIGN:
      return ' привязал к задаче: ' + value.task.caption
    case EnumEventTaskAssign.TASK_EVENT_DEASSIGN:
      return ' отвязал от задачи: ' + value.task.caption
    default:
      break;
  }
  return ' неизвестное действие';
}

export function taskAssignActionToHistory(value: EventTaskAssignHistory.AsObject): string {
  switch (value.action) {
    case EnumEventTaskAssign.TASK_EVENT_ASSIGN:
      return ' привязал к событию: ' + value.event.caption
    case EnumEventTaskAssign.TASK_EVENT_DEASSIGN:
      return ' отвязал от события: ' + value.event.caption
    default:
      break;
  }
  return ' неизвестное действие';
}

export function eventSourceClassAsString(classInd: EnumEventSourceClass): string {
  switch (classInd) {
    case EnumEventSourceClass.EVENT_SOURCE_NATURAL: return 'Опасные природные явления';
    case EnumEventSourceClass.EVENT_SOURCE_CONSTRUCTION: return 'Здания и сооружения';
    case EnumEventSourceClass.EVENT_SOURCE_TECHNOLOGICAL_DEVICE: return 'Технические устройства';
    case EnumEventSourceClass.EVENT_SOURCE_TECHNOLOGICAL_PROCESS: return 'Производственный процесс';
  }
  return '';
}

export function reglamentStatusAsString(value: boolean): string {
  for (let statusInd = 0; statusInd < reglamentStatusRegList.length; statusInd++) {
    if (reglamentStatusRegList[statusInd].id === value) {
      return reglamentStatusRegList[statusInd].caption
    }
  }
  return '';
}
export function dataInputTypeAsString(inputType: EnumDataInputType): string {
  switch (inputType) {
    case EnumDataInputType.DATA_INPUT_TYPE_MANUAL: return 'Ручной';
    case EnumDataInputType.DATA_INPUT_TYPE_AUTO: return 'Автоматический';
  }
  return '';
}

export function taskClassAsString(classInd: EnumTaskClass): string {
  switch (classInd) {
    case EnumTaskClass.TASK_CLASS_EVENT: return 'По событию';
    case EnumTaskClass.TASK_CLASS_GENERAL: return 'общее';
    case EnumTaskClass.TASK_CLASS_REGLAMENT: return 'по регламенту';
  }
  return '';
}


export function taskStatusAsString(value: EnumTaskStatus): string {
  for (let statusInd = 0; statusInd < taskStatusList.length; statusInd++) {
    if (taskStatusList[statusInd].id === value) {
      return taskStatusList[statusInd].caption
    }
  }
  return '';
}

export function reglamentActivationAsString(value: EnumReglamentActivationMode): string {
  for (let statusInd = 0; statusInd < reglamentActivationList.length; statusInd++) {
    if (reglamentActivationList[statusInd].id === value) {
      return reglamentActivationList[statusInd].caption
    }
  }
  return '';
}

export function reglamentRuntimeAsString(value: number): string {
  let res  = ''
  if ((Math.floor(value / 60)).toString().length < 2) {
    res = '0' + (Math.floor(value / 60)).toString() + 'ч:';
  } else {
    res = (Math.floor(value / 60)).toString() + 'ч:';
  }
  if ((value % 60).toString().length < 2) {
    res =  res + '0' + (value % 60).toString() + 'м';
  } else {
    res = res + (value % 60).toString() + 'м';
  }
  return res;
}

export function reglamentPeriodicityAsString(value: EnumReglamentPeriodicity): string {
  for (let statusInd = 0; statusInd < reglamentPeriodicityList.length; statusInd++) {
    if (reglamentPeriodicityList[statusInd].id === value) {
      return reglamentPeriodicityList[statusInd].caption
    }
  }
  return '';
}

export function measureTypeAsString(value: EnumMeasureValueType): string {
  for (let statusInd = 0; statusInd < measureTypeList.length; statusInd++) {
    if (measureTypeList[statusInd].id === value) {
      return measureTypeList[statusInd].caption
    }
  }
  return '';
}

export function reglamenStatusAsString(value: boolean): string {
  if (value) {
    return 'Активен'
  } else {
    return 'Не активен'
  }
}

export function eventStatusAsString(value: EnumEventStatus): string {
  for (let statusInd = 0; statusInd < eventStatusList.length; statusInd++) {
    if (eventStatusList[statusInd].id === value) {
      return eventStatusList[statusInd].caption
    }
  }
  return '';
}

export function taskSituationAsString(value: EnumTaskSituation): string {
  for (let statusInd = 0; statusInd < eventSituationList.length; statusInd++) {
    if (eventSituationList[statusInd].id === value) {
      return eventSituationList[statusInd].caption
    }
  }
  return '';
}
export function eventClassAsString(classInd: EnumEventClass): string {
  switch (classInd) {
    case EnumEventClass.EVENT_CLASS_ACCIDENT: return 'Авария';
    case EnumEventClass.EVENT_CLASS_INCIDENT: return 'Инцидент';
    case EnumEventClass.EVENT_CLASS_DANGER: return 'Опасные события';
    case EnumEventClass.EVENT_CLASS_FIRE: return 'Пожар';
  }
  return '';
}

export function getEvenSourceCaption(eventSource: EventSource.AsObject): string {

  if (eventSource && eventSource.caption) {
    return eventSource.caption + ' ' + eventSource.letteraxis.caption + eventSource.digitaxis.caption
      + ' ' + eventSource.levelmark.caption
  }
  return '';
}

export function dateAsString(date: Date): string {
  return formatDate(date, 'dd.MM.yyyy HH:mm:ss', 'ru');
}

export function unixNullDateAsString(date: jspb.Int64Value.AsObject): string {
  if (date && ((new Date(date.value)).getTime() > 0)) {
    return formatDate(new Date(date.value), 'dd.MM.yyyy', 'ru');
  } else {
    return ''
  }
}

export function unixDateAsString(date: number): string {
  return formatDate(new Date(date), 'dd.MM.yyyy HH:mm:ss', 'ru');
}
export function unixDateAsStringFormat(date: number, dateFormat: string): string {
  return formatDate(new Date(date), dateFormat, 'ru');
}

export function boolAsString(value: boolean): string {
  if (value) {
    return 'да'
  } else {
    return 'нет';
  }
}

export function normalizeManualParameters(manualRequestList: SittelleTypeManual_pb.ManualRequestValue.AsObject[],
  monObjectListPossible: Array<MonObjectShort.AsObject> = []) {
  manualRequestList.forEach(manualParam => {
    if (manualParam.ind === EnumManualParamSystem.MANUAL_PARAM_MON_OBJECT
      && monObjectListPossible.length > 0) {
      manualParam.valueListList.length = 0;
      for (let index = 0; index < monObjectListPossible.length; index++) {
        const monObject = monObjectListPossible[index];
        const addItem: SittelleTypeManual_pb.ManualListValue.AsObject = {
          caption: monObject.caption,
          value: monObject.monObjectInd.toString(),
          descr: '',
        }
        manualParam.valueListList.push(addItem);
      }
    }
    if (manualParam.parentParamListList.length > 0) {
      manualParam.valueListList.length = 0;
    } else {
      // console.log(manualParam.valueListList.size());
      if (manualParam.valueListList.length === 1) {
        manualParam.valueDf = manualParam.valueListList[0].value;
      }
    }
  });
}

export function numberInArray(value: number, array: number[]): boolean {
  for (let index = 0; index < array.length; index++) {
    if (array[index] === value) {
      return true
    }
  }
  // console.log(value, res);
  return false;
}
export function arrayAsString(array: number[]): string {
  let res = ''
  for (let index = 0; index < array.length; index++) {
    res = res + array[index] + ','
  }
  if (res !== '') {
    res = res.slice(0, res.length - 1)
  }
  // console.log(value, res);
  return res;
}

export function pickHex(color1, color2, weight: number): string {
  const w1 = weight / 100;
  const w2 = 1 - w1;
  const rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
  Math.round(color1[1] * w1 + color2[1] * w2),
  Math.round(color1[2] * w1 + color2[2] * w2)];
  return '#' + rgb[0].toString(16).padStart(2, '0') + rgb[1].toString(16).padStart(2, '0') + rgb[2].toString(16).padStart(2, '0')
}

export function numberToBitArray(value: number): number[] {
  const res: number[] = []
  // console.log(value);
  for (let i = 0; i < 32; i++) {
    if (((value >> i) & 1) === 1) {
      res.push(i)
    };
  }
  // console.log(value, res);
  return res;
}
export function checkBit(value: number, bit: number): boolean {
  return (value & (1 << bit)) === (1 << bit)
}


export function isCorrectSessionType(authorizationType: number) {
  if ((authorizationType === Number(EnumAuthorizationResult.SUCCESS)) ||
    (authorizationType === Number(EnumAuthorizationResult.TIME_IS_RUNNING_OUT_PASSWORD))) {
    return true
  } else {
    return false
  }
}


export function disabledEndDate(endValue: Date, startValue: Date): boolean {
  // if (!endValue || !datePlanningStart) {
  //   return false;
  // }
  // return endValue.getTime() < datePlanningStart.getTime();
  if (!endValue || !startValue) {
    return false
  } else {
    const d = new Date(startValue.getTime());
    d.setDate(d.getDate() - 1)
    return endValue < d;
  }
};

export function disabledStartDate(startValue: Date, endValue: Date,): boolean {
  if (!startValue || !endValue) {
    return false;
  }
  const compareStart = new Date(Date.UTC(startValue.getFullYear(), startValue.getMonth(), startValue.getDate()));
  const compareEnd = new Date(Date.UTC(endValue.getFullYear(),
    endValue.getMonth(), endValue.getDate()));
  return compareStart.getTime() > compareEnd.getTime();
};

export function eventSourceAsTreeForReglament(buildingInd: number, eventSourceList: Array<EventSource.AsObject>): TEventSourceTree[] {
  const eventSourceTreeList: TEventSourceTree[] = [];
  // console.log(eventSourceList);
  // console.log(eventSourceTreeList);
  
  eventSourceList.forEach(eventSource => {
    if ((eventSource.building.ind === buildingInd || buildingInd == 0) && eventSource.eventsourcekind.sourcetype.ind == 4) {
       let eventSourceKindFound = false;              
              for (let kindInd = 0; kindInd < eventSourceTreeList.length; kindInd++) {
                if (eventSourceTreeList[kindInd].ind === eventSource.eventsourcekind.ind) {
                  eventSourceTreeList[kindInd].children.push(
                    {
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                  )
                  eventSourceKindFound = true
                  break
                }
              }
              if (!eventSourceKindFound) {
                eventSourceTreeList.push(
                  {
                    ind: eventSource.eventsourcekind.ind,
                    title: eventSource.eventsourcekind.caption,
                    isLeaf: false,
                    selectable: false,
                    key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
                    children: new Array({
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                    ),
                  }
                );
              }    
    }
  });
  return eventSourceTreeList;
}

export function eventSourceAsTreeForBuilding(eventSourceList: Array<EventSource.AsObject>): TEventSourceTree[] {
  const eventSourceTreeList: TEventSourceTree[] = [];
  // console.log(eventSourceList);
  // console.log(eventSourceTreeList);
  
  eventSourceList.forEach(eventSource => {    
       let eventSourceBuildIndFound = false;              
              for (let builndingInd = 0; builndingInd < eventSourceTreeList.length; builndingInd++) {
                if (eventSourceTreeList[builndingInd].ind === eventSource.building.ind) {
                  eventSourceTreeList[builndingInd].children.push(
                    {
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.building.ind.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                  )
                  eventSourceBuildIndFound = true
                  break
                }
              }
              if (!eventSourceBuildIndFound) {
                eventSourceTreeList.push(
                  {
                    ind: eventSource.building.ind,
                    title: eventSource.building.caption,
                    isLeaf: false,
                    selectable: false,
                    key: eventSource.building.ind.toString() +
                      ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
                    children: new Array({
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.building.ind.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                    ),
                  }
                );
              }    
 
  });
  return eventSourceTreeList;
}

export function eventSourceAsTree(buildingInd: number, eventSourceList: Array<EventSource.AsObject>): TEventSourceTree[] {
  const eventSourceTreeList: TEventSourceTree[] = [];  
  eventSourceList.forEach(eventSource => {
    if (eventSource.building.ind === buildingInd || buildingInd == 0) {
      let eventSourceClassFound = false
      for (let classInd = 0; classInd < eventSourceTreeList.length; classInd++) {
        if (eventSourceTreeList[classInd].ind === eventSource.eventsourcekind.sourcetype.sourceclass) {
          let eventSourceTypeFound = false;
          for (let typeInd = 0; typeInd < eventSourceTreeList[classInd].children.length; typeInd++) {
            if (eventSourceTreeList[classInd].children[typeInd].ind === eventSource.eventsourcekind.sourcetype.ind) {
              let eventSourceKindFound = false;
              for (let kindInd = 0; kindInd < eventSourceTreeList[classInd].children[typeInd].children.length; kindInd++) {
                if (eventSourceTreeList[classInd].children[typeInd].children[kindInd].ind === eventSource.eventsourcekind.ind) {
                  eventSourceTreeList[classInd].children[typeInd].children[kindInd].children.push(
                    {
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                  )
                  eventSourceKindFound = true
                  break
                }
              }
              if (!eventSourceKindFound) {
                eventSourceTreeList[classInd].children[typeInd].children.push(
                  {
                    ind: eventSource.eventsourcekind.ind,
                    title: eventSource.eventsourcekind.caption,
                    isLeaf: false,
                    selectable: false,
                    key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
                    children: new Array({
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                    ),
                  }
                );
              }
              eventSourceTypeFound = true
              break
            }
          }
          if (!eventSourceTypeFound) {
            eventSourceTreeList[classInd].children.push(
              {
                ind: eventSource.eventsourcekind.sourcetype.ind,
                title: eventSource.eventsourcekind.sourcetype.caption,
                isLeaf: false,
                selectable: false,
                key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                  ' ' + eventSource.eventsourcekind.sourcetype.ind.toString(),
                children: new Array({
                  ind: eventSource.eventsourcekind.ind,
                  title: eventSource.eventsourcekind.caption,
                  isLeaf: false,
                  selectable: false,
                  key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                    ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
                  children: new Array({
                    ind: eventSource.ind,
                    title: getEvenSourceCaption(eventSource),
                    isLeaf: true,
                    selectable: true,
                    key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                      + ' ' + eventSource.ind.toString(),
                    children: new Array(),
                  }
                  ),
                }),
              }
            );
          }
          eventSourceClassFound = true
          break
        }
      }
      if (!eventSourceClassFound) {
        eventSourceTreeList.push({
          key: eventSource.eventsourcekind.sourcetype.sourceclass.toString(),
          ind: eventSource.eventsourcekind.sourcetype.sourceclass,
          isLeaf: false,
          selectable: false,
          title: eventSourceClassAsString(eventSource.eventsourcekind.sourcetype.sourceclass),
          children: new Array({
            ind: eventSource.eventsourcekind.sourcetype.ind,
            title: eventSource.eventsourcekind.sourcetype.caption,
            isLeaf: false,
            selectable: false,
            key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
              ' ' + eventSource.eventsourcekind.sourcetype.ind.toString(),
            children: new Array({
              ind: eventSource.eventsourcekind.ind,
              title: eventSource.eventsourcekind.caption,
              isLeaf: false,
              selectable: false,
              key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
              children: new Array({
                ind: eventSource.ind,
                title: getEvenSourceCaption(eventSource),
                isLeaf: true,
                selectable: true,
                key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                  ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                  + ' ' + eventSource.ind.toString(),
                children: new Array(),
              }
              ),
            }),
          }),
        });
      }
    }
  });
  return eventSourceTreeList;
}

export function eventSourceAsTreeForbuildings(buildingInd: number[], eventSourceList: Array<EventSource.AsObject>): TEventSourceTree[] {
  const eventSourceTreeList: TEventSourceTree[] = [];  
  eventSourceList.forEach(eventSource => {
    if (buildingInd.includes(eventSource.building.ind )) {
      let eventSourceClassFound = false
      for (let classInd = 0; classInd < eventSourceTreeList.length; classInd++) {
        if (eventSourceTreeList[classInd].ind === eventSource.eventsourcekind.sourcetype.sourceclass) {
          let eventSourceTypeFound = false;
          for (let typeInd = 0; typeInd < eventSourceTreeList[classInd].children.length; typeInd++) {
            if (eventSourceTreeList[classInd].children[typeInd].ind === eventSource.eventsourcekind.sourcetype.ind) {
              let eventSourceKindFound = false;
              for (let kindInd = 0; kindInd < eventSourceTreeList[classInd].children[typeInd].children.length; kindInd++) {
                if (eventSourceTreeList[classInd].children[typeInd].children[kindInd].ind === eventSource.eventsourcekind.ind) {
                  eventSourceTreeList[classInd].children[typeInd].children[kindInd].children.push(
                    {
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                  )
                  eventSourceKindFound = true
                  break
                }
              }
              if (!eventSourceKindFound) {
                eventSourceTreeList[classInd].children[typeInd].children.push(
                  {
                    ind: eventSource.eventsourcekind.ind,
                    title: eventSource.eventsourcekind.caption,
                    isLeaf: false,
                    selectable: false,
                    key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
                    children: new Array({
                      ind: eventSource.ind,
                      title: getEvenSourceCaption(eventSource),
                      isLeaf: true,
                      selectable: true,
                      key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                        + ' ' + eventSource.ind.toString(),
                      children: new Array(),
                    }
                    ),
                  }
                );
              }
              eventSourceTypeFound = true
              break
            }
          }
          if (!eventSourceTypeFound) {
            eventSourceTreeList[classInd].children.push(
              {
                ind: eventSource.eventsourcekind.sourcetype.ind,
                title: eventSource.eventsourcekind.sourcetype.caption,
                isLeaf: false,
                selectable: false,
                key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                  ' ' + eventSource.eventsourcekind.sourcetype.ind.toString(),
                children: new Array({
                  ind: eventSource.eventsourcekind.ind,
                  title: eventSource.eventsourcekind.caption,
                  isLeaf: false,
                  selectable: false,
                  key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                    ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
                  children: new Array({
                    ind: eventSource.ind,
                    title: getEvenSourceCaption(eventSource),
                    isLeaf: true,
                    selectable: true,
                    key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                      + ' ' + eventSource.ind.toString(),
                    children: new Array(),
                  }
                  ),
                }),
              }
            );
          }
          eventSourceClassFound = true
          break
        }
      }
      if (!eventSourceClassFound) {
        eventSourceTreeList.push({
          key: eventSource.eventsourcekind.sourcetype.sourceclass.toString(),
          ind: eventSource.eventsourcekind.sourcetype.sourceclass,
          isLeaf: false,
          selectable: false,
          title: eventSourceClassAsString(eventSource.eventsourcekind.sourcetype.sourceclass),
          children: new Array({
            ind: eventSource.eventsourcekind.sourcetype.ind,
            title: eventSource.eventsourcekind.sourcetype.caption,
            isLeaf: false,
            selectable: false,
            key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
              ' ' + eventSource.eventsourcekind.sourcetype.ind.toString(),
            children: new Array({
              ind: eventSource.eventsourcekind.ind,
              title: eventSource.eventsourcekind.caption,
              isLeaf: false,
              selectable: false,
              key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString(),
              children: new Array({
                ind: eventSource.ind,
                title: getEvenSourceCaption(eventSource),
                isLeaf: true,
                selectable: true,
                key: eventSource.eventsourcekind.sourcetype.sourceclass.toString() +
                  ' ' + eventSource.eventsourcekind.sourcetype.ind.toString() + ' ' + eventSource.eventsourcekind.ind.toString()
                  + ' ' + eventSource.ind.toString(),
                children: new Array(),
              }
              ),
            }),
          }),
        });
      }
    }
  });
  return eventSourceTreeList;
}

export function parameterSourceAsTree(buildingInd: number, parameterList: Array<Parameter.AsObject>): TEventSourceTree[] {
  const eventSourceTreeList: TEventSourceTree[] = [];
  parameterList.forEach(parameter => {
    if (parameter.eventsource && parameter.eventsource.building.ind === buildingInd) {
      let eventSourceClassFound = false
      for (let classInd = 0; classInd < eventSourceTreeList.length; classInd++) {
        if (eventSourceTreeList[classInd].ind === parameter.eventsource.eventsourcekind.sourcetype.sourceclass) {
          let eventSourceTypeFound = false;
          for (let typeInd = 0; typeInd < eventSourceTreeList[classInd].children.length; typeInd++) {
            if (eventSourceTreeList[classInd].children[typeInd].ind === parameter.eventsource.eventsourcekind.sourcetype.ind) {
              let eventSourceKindFound = false;
              for (let kindInd = 0; kindInd < eventSourceTreeList[classInd].children[typeInd].children.length; kindInd++) {
                if (eventSourceTreeList[classInd].children[typeInd].children[kindInd].ind === parameter.eventsource.eventsourcekind.ind) {
                  eventSourceTreeList[classInd].children[typeInd].children[kindInd].children.push(
                    {
                      ind: parameter.eventsource.ind,
                      title: getEvenSourceCaption(parameter.eventsource),
                      isLeaf: true,
                      key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString()
                        + ' ' + parameter.eventsource.eventsourcekind.ind.toString()
                        + ' ' + parameter.eventsource.ind.toString(),
                      children: new Array(),
                    }
                  )
                  eventSourceKindFound = true
                  break
                }
              }
              if (!eventSourceKindFound) {
                eventSourceTreeList[classInd].children[typeInd].children.push(
                  {
                    ind: parameter.eventsource.eventsourcekind.ind,
                    title: parameter.eventsource.eventsourcekind.caption,
                    isLeaf: false,
                    key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString()
                      + ' ' + parameter.eventsource.eventsourcekind.ind.toString(),
                    children: new Array({
                      ind: parameter.eventsource.ind,
                      title: getEvenSourceCaption(parameter.eventsource),
                      isLeaf: true,
                      key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                        ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString()
                        + ' ' + parameter.eventsource.eventsourcekind.ind.toString()
                        + ' ' + parameter.eventsource.ind.toString(),
                      children: new Array(),
                    }
                    ),
                  }
                );
              }
              eventSourceTypeFound = true
              break
            }
          }
          if (!eventSourceTypeFound) {
            eventSourceTreeList[classInd].children.push(
              {
                ind: parameter.eventsource.eventsourcekind.sourcetype.ind,
                title: parameter.eventsource.eventsourcekind.sourcetype.caption,
                isLeaf: false,
                key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                  ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString(),
                children: new Array({
                  ind: parameter.eventsource.eventsourcekind.ind,
                  title: parameter.eventsource.eventsourcekind.caption,
                  isLeaf: false,
                  key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                    ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString()
                    + ' ' + parameter.eventsource.eventsourcekind.ind.toString(),
                  children: new Array({
                    ind: parameter.eventsource.ind,
                    title: getEvenSourceCaption(parameter.eventsource),
                    isLeaf: true,
                    key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                      ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString() +
                      ' ' + parameter.eventsource.eventsourcekind.ind.toString()
                      + ' ' + parameter.eventsource.ind.toString(),
                    children: new Array(),
                  }
                  ),
                }),
              }
            );
          }
          eventSourceClassFound = true
          break
        }
      }
      if (!eventSourceClassFound) {
        eventSourceTreeList.push({
          key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString(),
          ind: parameter.eventsource.eventsourcekind.sourcetype.sourceclass,
          isLeaf: false,
          title: eventSourceClassAsString(parameter.eventsource.eventsourcekind.sourcetype.sourceclass),
          children: new Array({
            ind: parameter.eventsource.eventsourcekind.sourcetype.ind,
            title: parameter.eventsource.eventsourcekind.sourcetype.caption,
            isLeaf: false,
            key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
              ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString(),
            children: new Array({
              ind: parameter.eventsource.eventsourcekind.ind,
              title: parameter.eventsource.eventsourcekind.caption,
              isLeaf: false,
              key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString() +
                ' ' + parameter.eventsource.eventsourcekind.ind.toString(),
              children: new Array({
                ind: parameter.eventsource.ind,
                title: getEvenSourceCaption(parameter.eventsource),
                isLeaf: true,
                key: parameter.eventsource.eventsourcekind.sourcetype.sourceclass.toString() +
                  ' ' + parameter.eventsource.eventsourcekind.sourcetype.ind.toString() +
                  ' ' + parameter.eventsource.eventsourcekind.ind.toString()
                  + ' ' + parameter.eventsource.ind.toString(),
                children: new Array(),
              }
              ),
            }),
          }),
        });
      }
    }
  });
  return eventSourceTreeList;
}

export function eventKindAsTree(sourceKindInd: number, eventKindList: Array<EventKind.AsObject>): TEventKindTree[] {
  const eventKindTreeList: TEventKindTree[] = [];
  eventKindList.forEach(eventKind => {
    if (eventKind.eventsourcekind.ind === sourceKindInd) {
      let eventClassFound = false
      for (let classInd = 0; classInd < eventKindTreeList.length; classInd++) {
        if (eventKindTreeList[classInd].ind === eventKind.eventtype.eventclass) {
          let eventTypeFound = false;
          for (let typeInd = 0; typeInd < eventKindTreeList[classInd].children.length; typeInd++) {
            if (eventKindTreeList[classInd].children[typeInd].ind === eventKind.eventtype.ind) {
              eventKindTreeList[classInd].children[typeInd].children.push(
                {
                  ind: eventKind.ind,
                  title: eventKind.caption,
                  isLeaf: true,
                  key: eventKind.eventtype.eventclass.toString() +
                    ' ' + eventKind.eventtype.toString()
                    + ' ' + eventKind.ind.toString(),
                  children: new Array(),
                }
              )
              eventTypeFound = true
              break
            }
          }
          if (!eventTypeFound) {
            eventKindTreeList[classInd].children.push(
              {
                ind: eventKind.eventtype.ind,
                title: eventKind.eventtype.caption,
                isLeaf: false,
                key: eventKind.eventtype.eventclass.toString() +
                  ' ' + eventKind.eventtype.ind.toString(),
                children: new Array({
                  ind: eventKind.ind,
                  title: eventKind.caption,
                  isLeaf: true,
                  key: eventKind.eventtype.eventclass.toString() +
                    ' ' + eventKind.eventtype.ind.toString() 
                    + ' ' + eventKind.ind.toString(),
                  children: new Array(),
                }
                ),
              }
            );
          }
          eventClassFound = true
          break
        }
      }
      if (!eventClassFound) {
        eventKindTreeList.push({
          key: eventKind.eventtype.eventclass.toString(),
          ind: eventKind.eventtype.eventclass,
          isLeaf: false,
          title: eventClassAsString(eventKind.eventtype.eventclass),
          children: new Array({
            ind: eventKind.eventtype.ind,
            title: eventKind.eventtype.caption,
            isLeaf: false,
            key: eventKind.eventtype.eventclass.toString() +
              ' ' + eventKind.eventtype.ind.toString(),
            children: new Array({
              ind: eventKind.ind,
              title: eventKind.caption,
              isLeaf: true,
              key: eventKind.eventtype.eventclass.toString() +
                ' ' + eventKind.eventtype.ind.toString()
                + ' ' + eventKind.ind.toString(),
              children: new Array(),
            }),
          }),
        });
      }
    }
  });
  return eventKindTreeList;
}

export function documentKindAsTreeNoClass(documentKindInd: number, documentKindList: Array<DocumentKind.AsObject>): TDocumentKindTree[] {
  const documentKindTreeList: TDocumentKindTree[] = [];
  documentKindList.forEach(documentKind => {
    if (documentKind.ind === documentKindInd || documentKindInd === 0) {      
      let documentTypeFound = false;          
          for (let typeInd = 0; typeInd < documentKindTreeList.length; typeInd++) {
            if (documentKindTreeList[typeInd].ind === documentKind.documenttype.ind) {
              documentKindTreeList[typeInd].children.push(
                {
                  ind: documentKind.ind,
                  title: documentKind.caption,
                  isLeaf: true,
                  selectable: true,
                  key: documentKind.documenttype.documentclass.ind.toString() +
                    ' ' + documentKind.documenttype.ind.toString()
                    + ' ' + documentKind.ind.toString(),
                  children: new Array(),                  
                }
              )
              documentTypeFound = true
              break
            }
          }
          if (!documentTypeFound) {
            documentKindTreeList.push(
              {
                ind: documentKind.documenttype.ind,
                title: documentKind.documenttype.caption,
                isLeaf: false,
                selectable: false,
                key: documentKind.documenttype.documentclass.ind.toString() +
                  ' ' + documentKind.documenttype.ind.toString(),
                children: new Array({
                  ind: documentKind.ind,
                  title: documentKind.caption,
                  isLeaf: true,
                  selectable: true,
                  key: documentKind.documenttype.documentclass.ind.toString() +
                    ' ' + documentKind.documenttype.ind.toString()
                    + ' ' + documentKind.ind.toString(),
                  children: new Array(),
                }
                ),
              }
            );
          }        
    }
  });
  return documentKindTreeList;
}

export function documentKindAsTree(documentKindInd: number, documentKindList: Array<DocumentKind.AsObject>): TDocumentKindTree[] {
  const documentKindTreeList: TDocumentKindTree[] = [];
  documentKindList.forEach(documentKind => {
    if (documentKind.ind === documentKindInd || documentKindInd === 0) {
      let documentClassFound = false
      for (let classInd = 0; classInd < documentKindTreeList.length; classInd++) {
        if (documentKindTreeList[classInd].ind === documentKind.documenttype.documentclass.ind) {
          let documentTypeFound = false;
          for (let typeInd = 0; typeInd < documentKindTreeList[classInd].children.length; typeInd++) {
            if (documentKindTreeList[classInd].children[typeInd].ind === documentKind.documenttype.ind) {
              documentKindTreeList[classInd].children[typeInd].children.push(
                {
                  ind: documentKind.ind,
                  title: documentKind.caption,
                  isLeaf: true,
                  key: documentKind.documenttype.documentclass.ind.toString() +
                    ' ' + documentKind.documenttype.ind.toString()
                    + ' ' + documentKind.ind,
                  children: new Array(),
                }
              )
              documentTypeFound = true
              break
            }
          }
          if (!documentTypeFound) {
            documentKindTreeList[classInd].children.push(
              {
                ind: documentKind.documenttype.ind,
                title: documentKind.documenttype.caption,
                isLeaf: false,
                key: documentKind.documenttype.documentclass.ind.toString() +
                  ' ' + documentKind.documenttype.ind.toString(),
                children: new Array({
                  ind: documentKind.ind,
                  title: documentKind.caption,
                  isLeaf: true,
                  key: documentKind.documenttype.documentclass.ind.toString() +
                    ' ' + documentKind.documenttype.ind.toString() +
                    + ' ' + documentKind.ind,
                  children: new Array(),
                }
                ),
              }
            );
          }
          documentClassFound = true
          break
        }
      }
      if (!documentClassFound) {
        documentKindTreeList.push({
          key: documentKind.documenttype.documentclass.ind.toString(),
          ind: documentKind.documenttype.documentclass.ind,
          isLeaf: false,
          title: documentKind.documenttype.documentclass.caption,
          children: new Array({
            ind: documentKind.documenttype.ind,
            title: documentKind.documenttype.caption,
            isLeaf: false,
            key: documentKind.documenttype.documentclass.ind.toString() +
              ' ' + documentKind.documenttype.ind.toString(),
            children: new Array({
              ind: documentKind.ind,
              title: documentKind.caption,
              isLeaf: true,
              key: documentKind.documenttype.documentclass.ind.toString() +
                ' ' + documentKind.documenttype.ind.toString() +
                + ' ' + documentKind.ind,
              children: new Array(),
            }),
          }),
        });
      }
    }
  });
  return documentKindTreeList;
}

export function documentAsTree(documentKindInd: number, documentList: Array<Document.AsObject>): TDocumentTree[] {
  const documentTreeList: TDocumentTree[] = [];
  documentList.forEach(document => {
    if (document.documentkind && document.documentkind.ind === documentKindInd || documentKindInd === 0) {
      let documentClassFound = false
      for (let classInd = 0; classInd < documentTreeList.length; classInd++) {
        if (documentTreeList[classInd].ind === document.documentkind.documenttype.documentclass.ind) {
          let documentTypeFound = false;
          for (let typeInd = 0; typeInd < documentTreeList[classInd].children.length; typeInd++) {
            if (documentTreeList[classInd].children[typeInd].ind === document.documentkind.documenttype.ind) {
              let documentKindFound = false;
              for (let kindInd = 0; kindInd < documentTreeList[classInd].children[typeInd].children.length; kindInd++) {
                if (documentTreeList[classInd].children[typeInd].children[kindInd].ind === document.documentkind.ind) {
                  documentTreeList[classInd].children[typeInd].children[kindInd].children.push(
                    {
                      ind: document.ind,
                      title: document.caption,
                      isLeaf: true,
                      key: document.documentkind.documenttype.documentclass.ind.toString() +
                        ' ' + document.documentkind.documenttype.ind.toString()
                        + ' ' + document.documentkind.ind.toString()
                        + ' ' + document.ind,
                      children: new Array(),
                    }
                  )
                  documentKindFound = true
                  break
                }
              }
              if (!documentKindFound) {
                documentTreeList[classInd].children[typeInd].children.push(
                  {
                    ind: document.documentkind.ind,
                    title: document.documentkind.caption,
                    isLeaf: false,
                    key: document.documentkind.documenttype.documentclass.ind.toString() +
                      ' ' + document.documentkind.documenttype.ind.toString()
                      + ' ' + document.documentkind.ind.toString(),
                    children: new Array({
                      ind: document.ind,
                      title: document.caption,
                      isLeaf: true,
                      key: document.documentkind.documenttype.documentclass.ind.toString() +
                        ' ' + document.documentkind.documenttype.ind.toString()
                        + ' ' + document.documentkind.ind.toString()
                        + ' ' + document.ind,
                      children: new Array(),
                    }
                    ),
                  }
                );
              }
              documentTypeFound = true
              break
            }
          }
          if (!documentTypeFound) {
            documentTreeList[classInd].children.push(
              {
                ind: document.documentkind.documenttype.ind,
                title: document.documentkind.documenttype.caption,
                isLeaf: false,
                key: document.documentkind.documenttype.documentclass.ind.toString() +
                  ' ' + document.documentkind.documenttype.ind.toString(),
                children: new Array({
                  ind: document.documentkind.ind,
                  title: document.documentkind.caption,
                  isLeaf: false,
                  key: document.documentkind.documenttype.documentclass.ind.toString() +
                    ' ' + document.documentkind.documenttype.ind.toString()
                    + ' ' + document.documentkind.ind.toString(),
                  children: new Array({
                    ind: document.ind,
                    title: document.caption,
                    isLeaf: true,
                    key: document.documentkind.documenttype.documentclass.ind.toString() +
                      ' ' + document.documentkind.documenttype.ind.toString() +
                      ' ' + document.documentkind.ind.toString()
                      + ' ' + document.ind,
                    children: new Array(),
                  }
                  ),
                }),
              }
            );
          }
          documentClassFound = true
          break
        }
      }
      if (!documentClassFound) {
        documentTreeList.push({
          key: document.documentkind.documenttype.documentclass.ind.toString(),
          ind: document.documentkind.documenttype.documentclass.ind,
          isLeaf: false,
          title: document.documentkind.documenttype.documentclass.caption,
          children: new Array({
            ind: document.documentkind.documenttype.ind,
            title: document.documentkind.documenttype.caption,
            isLeaf: false,
            key: document.documentkind.documenttype.documentclass.ind.toString() +
              ' ' + document.documentkind.documenttype.ind.toString(),
            children: new Array({
              ind: document.documentkind.ind,
              title: document.documentkind.caption,
              isLeaf: false,
              key: document.documentkind.documenttype.documentclass.ind.toString() +
                ' ' + document.documentkind.documenttype.ind.toString() +
                ' ' + document.documentkind.ind.toString(),
              children: new Array({
                ind: document.ind,
                title: document.caption,
                isLeaf: true,
                key: document.documentkind.documenttype.documentclass.ind.toString() +
                  ' ' + document.documentkind.documenttype.ind.toString() +
                  ' ' + document.documentkind.ind.toString()
                  + ' ' + document.ind,
                children: new Array(),
              }
              ),
            }),
          }),
        });
      }
    }
  });
  return documentTreeList;
}
