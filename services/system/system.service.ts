import { Injectable } from '@angular/core';
import { ExternalInputSett } from '@api/SittelleTypeClient_pb'
import { NzMessageService } from 'ng-zorro-antd/message';
import * as SittelleTypeManual_pb from '@api/SittelleTypeManual_pb';
import * as SittelleServiceDictionary_pb from '@api/SittelleServiceDictionary_pb';
import * as SittelleTypeDictionary_pb from '@api/SittelleTypeDictionary_pb';
import { EnumAuthorizationResult, EnumManualParamType, EnumStatusGroup, EnumTaskField } from '@api/SittelleConst_pb'
import { formatDate } from '@angular/common';
import { GrpcService } from '@projectApp/services/grpc.service';
import * as grpcWeb from 'grpc-web';
import { DictionaryClient } from '@api/SittelleServiceDictionaryServiceClientPb';
import { CookieService } from '@projectApp/services/cookie.service';
import * as environment from '../../../environments/environment';
import { element } from 'protractor';
import * as CommonTypes from '@projectApp/common/common-types';
import * as SittelleTypeOffice_pb from '@api/SittelleTypeOffice_pb';

export function contractActiveForDate(contract: SittelleTypeOffice_pb.Contract.AsObject, date: Date): boolean {
  return true
}

export enum EnumManualParamSystem1 {

  MANUAL_PARAM_REGISTER_FROM = 10,
  MANUAL_PARAM_REGISTER_TILL = 11,
}

export enum EnumSystemTaskStatus1 {
  STATUS_CHECK_CONNECTION_FAILED = -137,
  STATUS_CHECK_CONNECTION_PASSED = -136,
}

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private readonly dictionaryClient: DictionaryClient;

  manualParamList: Array<SittelleTypeDictionary_pb.ManualInfo.AsObject> = [];
  statusListMap: Array<SittelleTypeDictionary_pb.DictStatus.AsObject> = [];
  statusGroupList: Array<SittelleTypeDictionary_pb.DictStatusGroup.AsObject> = [];
  statusListWithTypeCaption: Array<SittelleTypeDictionary_pb.DictStatus.AsObject> = []
  // separate status group for grouping
  statusGroupGrouping: SittelleTypeDictionary_pb.DictStatusGroup.AsObject = {
    ind: 0,
    caption: '',
    color: 0,
    descr: '',
    sett: 0,
    statusIndListList: []
  };
  statusGroupClosed: SittelleTypeDictionary_pb.DictStatusGroup.AsObject = {
    ind: 0,
    caption: '',
    color: 0,
    descr: '',
    sett: 0,
    statusIndListList: []
  };
  statusGroupFixStatus: SittelleTypeDictionary_pb.DictStatusGroup.AsObject = {
    ind: 0,
    caption: '',
    color: 0,
    descr: '',
    sett: 0,
    statusIndListList: []
  };
  monObjectListMap: Array<SittelleTypeDictionary_pb.MonObjectShort.AsObject> = [];
  engSystemTypeListMap: Array<SittelleTypeDictionary_pb.MonObjectShort.AsObject> = [];
  monObjectList: Array<SittelleTypeDictionary_pb.MonObjectShort.AsObject> = [];
  // monObjectActiveList: Array<SittelleTypeDictionary_pb.MonObjectShort.AsObject> = [];
  taskTypeListMap: Array<SittelleTypeDictionary_pb.DictTaskTypeSett.AsObject> = [];
  taskTypeActiveList: Array<SittelleTypeDictionary_pb.DictTaskTypeSett.AsObject> = [];

  priorityList: Array<CommonTypes.TTaskPriority> = [];
  FIRST_PASSWORD = EnumAuthorizationResult.FIRST_PASSWORD;
  First: any;

  constructor(private Grpc: GrpcService, private cookie: CookieService, private messageService: NzMessageService) {
    if (!this.dictionaryClient) {
      this.dictionaryClient = Grpc.DictionaryServiceClient;
    }
    const sid = this.cookie.get('sid') || '';

    this.First = this.cookie.get('authorizationType')
    // console.log(First);
    if (this.FIRST_PASSWORD === this.First) {
      console.log("FIRST_PASSWORD");
    } else {
      if (sid !== '') {
        this.updateDictionary(sid)
      }
    }
    this.priorityList.push({ ind: 0, caption: 'Низкий' });
    this.priorityList.push({ ind: 40, caption: 'Средний' });
    this.priorityList.push({ ind: 70, caption: 'Высокий' });
    this.priorityList.push({ ind: 100, caption: 'Неотложный' });
  }

  priorityGetByValue(value: number): number{
    if (value < 40){
      return 0
    } else if (value < 70){
      return 40
    } else if (value < 100){
      return 70
    } else {
      return 100
    }
  }

  updateDictionary(sessId: string) {
    // console.log(sessId);
    // console.log(authorizationType);

    // if (authorizationType == 1) {
    this.taskTypeActiveList = []
    const reqParamList = new SittelleServiceDictionary_pb.ManualInfoListRequest();
    // reqParamList.setSessId(sessId);
    this.dictionaryClient.manualInfoList(reqParamList, null,
      (err: grpcWeb.Error, response: SittelleServiceDictionary_pb.ManualInfoListRes) => {
        if (err) {
          console.log(reqParamList.toObject())
          console.log(err);
        }
        const data = response.toObject();
        this.manualParamList = data.listList
        // console.log(this.manualParamList);
      });

    const reqStatusList = new SittelleServiceDictionary_pb.DictStatusListRequest();

    this.dictionaryClient.dictStatusList(reqStatusList, null,
      (err: grpcWeb.Error, response: SittelleServiceDictionary_pb.DictStatusListRes) => {
        if (err) {
          console.log(reqStatusList.toObject())
          console.log(err);
        }
        const data = response.toObject();
        data.statusListList.forEach(status => {
          // element.
          this.statusListMap[status.ind] = status
        });
        const reqTaskTypeList = new SittelleServiceDictionary_pb.DictTaskTypeListRequest();

        this.dictionaryClient.dictTaskTypeList(reqTaskTypeList, null,
          (taskTypeErr: grpcWeb.Error, taskTypeResponse: SittelleServiceDictionary_pb.DictTaskTypeListRes) => {
            if (err) {
              console.log(reqTaskTypeList.toObject())
              console.log(taskTypeErr);
            }
            const taskTypeRes = taskTypeResponse.toObject();
            taskTypeRes.taskTypeListList.forEach(taskType => {
              // element.
              this.taskTypeListMap[taskType.ind] = taskType
              this.taskTypeActiveList.push(taskType);
            });

            this.statusListWithTypeCaption = [];
            // tslint:disable-next-line:forin
            for (const key in this.statusListMap) {
              const value = Object.assign({}, this.statusListMap[key]);
              value.captionStatus = value.captionStatus + '.' + this.taskTypeListMap[value.taskTypeInd].captionRegion;
              this.statusListWithTypeCaption.push(value);
            }
            this.statusListWithTypeCaption = this.statusListWithTypeCaption.sort((n1, n2) => n1.captionStatus > n2.captionStatus ? 1 : -1);
            // console.log(this.statusListWithTypeCaption);
            // console.log(this.statusListMap);
          });

        // this.statusList = data.statusListList;

      });

    const reqStatusGroupList = new SittelleServiceDictionary_pb.DictStatusGroupListRequest();

    this.dictionaryClient.dictStatusGroupList(reqStatusGroupList, null,
      (err: grpcWeb.Error, response: SittelleServiceDictionary_pb.DictStatusGroupListRes) => {
        if (err) {
          console.log(reqStatusGroupList.toObject())
          console.log(err);
        }
        const data = response.toObject();

        this.statusGroupList = data.statusGroupListList;
        // separate status group for grouping
        for (let index = 0; index < this.statusGroupList.length; index++) {
          if (this.statusGroupList[index].ind === EnumStatusGroup.STATUS_GROUP_GROUPING) {
            this.statusGroupGrouping = this.statusGroupList[index]
          }
          if (this.statusGroupList[index].ind === EnumStatusGroup.STATUS_GROUP_CLOSED) {
            this.statusGroupClosed = this.statusGroupList[index]
          }
          if (this.statusGroupList[index].ind === EnumStatusGroup.STATUS_GROUP_FIX_STATUS) {
            this.statusGroupFixStatus = this.statusGroupList[index]
          }
        }
        // console.log(data.statusGroupListList);
      });

    const reqMonObjectList = new SittelleServiceDictionary_pb.DictMonObjectListRequest();
    // this.monObjectActiveList = [];
    this.monObjectList = [];
    this.dictionaryClient.dictMonObjectList(reqMonObjectList, null,
      (err: grpcWeb.Error, response: SittelleServiceDictionary_pb.DictMonObjectListRes) => {
        if (err) {
          console.log(reqMonObjectList.toObject())
          console.log(err);
        }
        const data = response.toObject();
        data.monObjectListList.forEach(monObject => {
          this.monObjectListMap[monObject.monObjectInd] = monObject
          // if (monObject.active) {
          //   this.monObjectActiveList.push(monObject)
          // }
          this.monObjectList.push(monObject)
        });
        // console.log(data.statusGroupListList);
      });

    // console.log(this.manualParamList);
    // console.log(this.statusList);
    // }
  }

  paramValueAsString(taskManual: SittelleTypeManual_pb.ManualValue.AsObject, ...numberArray: number[]): string {
    for (let index = 0; index < this.manualParamList.length; index++) {
      if (this.manualParamList[index].ind === taskManual.paramInd) {
        switch (this.manualParamList[index].paramType) {
          case EnumManualParamType.MANUAL_TYPE_DATETIME:
            if (numberArray.length === 1) {
              return formatDate(taskManual.value, 'dd.MM.yyyy HH:mm:ss', 'ru', '+' + numberArray[0] + '00');
            } else {
              return formatDate(taskManual.value, 'dd.MM.yyyy HH:mm:ss', 'ru');
            }
          case EnumManualParamType.MANUAL_TYPE_DATE:
            return formatDate(taskManual.value, 'dd.MM.yyyy', 'ru');
          case EnumManualParamType.MANUAL_TYPE_TIME:
            if (numberArray.length === 1) {
              return formatDate(taskManual.value, 'HH:mm:ss', 'ru', '+' + numberArray[0] + '00');
            } else {
              return formatDate(taskManual.value, 'HH:mm:ss', 'ru');
            }
          default:
            return taskManual.caption;
        }
      }
    }
    return '';
  }

  statusIsGrouping(statusInd: number): boolean {
    for (let index = 0; index < this.statusGroupGrouping.statusIndListList.length; index++) {
      if (this.statusGroupGrouping.statusIndListList[index] === statusInd) {
        return true
      }
    }
    return false
  }
  statusIsClosed(statusInd: number): boolean {
    for (let index = 0; index < this.statusGroupClosed.statusIndListList.length; index++) {
      if (this.statusGroupClosed.statusIndListList[index] === statusInd) {
        return true
      }
    }
    return false
  }
  statusIsFixStatus(statusInd: number): boolean {
    for (let index = 0; index < this.statusGroupFixStatus.statusIndListList.length; index++) {
      if (this.statusGroupFixStatus.statusIndListList[index] === statusInd) {
        return true
      }
    }
    return false
  }

  paramByInd(paramInd: number): SittelleTypeDictionary_pb.ManualInfo.AsObject {
    for (let index = 0; index < this.manualParamList.length; index++) {
      if (this.manualParamList[index].ind === paramInd) {
        return this.manualParamList[index]
      }
    }
    return {
      ind: 0,
      id: '',
      caption: '',
      paramType: 0,
      isObligatory: false,
      linkInd: 0,
      taskTypeListList: []
    }
  }

  checkManualParameters(manualRequestList: SittelleTypeManual_pb.ManualRequestValue.AsObject[]): boolean {
    // console.log(createTaskData)
    // check obligatory params
    for (let paramIndex = 0; paramIndex < manualRequestList.length; paramIndex++) {
      if (manualRequestList[paramIndex].isObligatory) {
        switch (manualRequestList[paramIndex].paramType) {
          case EnumManualParamType.MANUAL_TYPE_INTEGER:
          case EnumManualParamType.MANUAL_TYPE_FLOAT:
            if ((manualRequestList[paramIndex].valueDf === null)
              || (manualRequestList[paramIndex].valueDf.toString() === manualRequestList[paramIndex].valueNull.toString())) {
              this.messageService.error(`Не заполнено обязательное поле: ` + manualRequestList[paramIndex].caption);
              return false
            }
            break;
          default:
            if ((manualRequestList[paramIndex].valueDf === null)
              || (manualRequestList[paramIndex].valueDf.trim() === manualRequestList[paramIndex].valueNull.trim())) {
              this.messageService.error(`Не заполнено обязательное поле: ` + manualRequestList[paramIndex].caption);
              return false
            }
            break;
        }
      }
    };
    const paramFrom = this.paramRequestByInd(EnumManualParamSystem1.MANUAL_PARAM_REGISTER_FROM, manualRequestList)
    const paramTill = this.paramRequestByInd(EnumManualParamSystem1.MANUAL_PARAM_REGISTER_TILL, manualRequestList)
    if (paramFrom && paramTill) {
      if (paramFrom.valueDf !== null && paramTill.valueDf !== null &&
        paramFrom.valueDf !== '0' && paramTill.valueDf !== '0' && Number(paramFrom.valueDf) > Number(paramTill.valueDf)) {
        this.messageService.error(`Дата начала не может быть позже даты завершения`);
        return false;
      }
    }

    return true
  }

  paramRequestByInd(paramInd: number, manualRequestList: SittelleTypeManual_pb.ManualRequestValue.AsObject[]):
    SittelleTypeManual_pb.ManualRequestValue.AsObject {
    for (let index = 0; index < manualRequestList.length; index++) {
      if (manualRequestList[index].ind === paramInd) {
        return manualRequestList[index]
      }
    }
    return null;
  }




  statusColorGet(statusInd: number) {
    if (this.statusListMap[statusInd]) {
      return '#' + this.statusListMap[statusInd].colorBackground.toString(16).padStart(6, '0').toLowerCase();
    }
    return '#000000';
  }
  statusTextGet(statusInd: number): string {
    if (this.statusListMap[statusInd]) {
      return this.statusListMap[statusInd].captionStatus;
    }
    return '';
  }

  checkInputParameters(createTaskData: ExternalInputSett.AsObject[]): boolean {
    // console.log(createTaskData)
    // check obligatory params
    for (let inputIndex = 0; inputIndex < createTaskData.length; inputIndex++) {
      if (CommonTypes.checkBit(createTaskData[inputIndex].fieldManual, EnumTaskField.TASK_FIELD_CONTENT_CAPTION)
      && (createTaskData[inputIndex].valueList.content.contentCaption.trim() === '')) {
        this.messageService.error(`Не заполнено обязательное поле: Название задачи`);
        return false
      }
      if (CommonTypes.checkBit(createTaskData[inputIndex].fieldManual, EnumTaskField.TASK_FIELD_ITEM_MON_OBJECT)
        && (createTaskData[inputIndex].valueList.item.monObjectInd === -1)
      ) {
        this.messageService.error(`Не заполнено обязательное поле: Объект мониторинга`);
        return false
      }
      // check time range
      if (CommonTypes.checkBit(createTaskData[inputIndex].fieldManual, EnumTaskField.TASK_FIELD_CONTENT_DATE_PLANNING_START)
        && CommonTypes.checkBit(createTaskData[inputIndex].fieldManual, EnumTaskField.TASK_FIELD_CONTENT_DATE_PLANNING_START)) {
        if (createTaskData[inputIndex].valueList.content.datePlanningStart !== 0
          && createTaskData[inputIndex].valueList.content.datePlanningEnd !== 0 &&
          createTaskData[inputIndex].valueList.content.datePlanningStart > createTaskData[inputIndex].valueList.content.datePlanningEnd) {
          this.messageService.error(`Дата начала не может быть позже даты завершения`);
          return false;
        }
      }
      // console.log(createTaskData[inputIndex].manualRequestList);
      if (!this.checkManualParameters(createTaskData[inputIndex].manualRequestList)) {
        return false
      }
    };
    return true
  }

}


