import {
  EnumEventSourceClass,
  EnumDataInputType,
  EnumTaskClass,
  EnumTaskStatus,
  EnumTaskSituation,
  EnumEventStatus,
  EnumEventClass,
  EnumReglamentPeriodicity,
  EnumReglamentActivationMode,
  EnumParameterStatus,
  EnumMeasureValueType,
} from '@api/typeConst_pb';
import * as grpcWeb from 'grpc-web';
import * as SittelleTypeManual_pb from '@api/typeManual_pb';
import * as ThemeService from '@projectApp/theme/theme.service';
import { formatDate } from '@angular/common';
import * as jspb from 'google-protobuf';
import { ManualRequestValue } from '@api/typeManual_pb'
import { MonObjectShort } from '@projectApp/api/serviceTuner_pb';
import {
  BuildingInfo, EventSource, Event, EventCommentHistory, EventStatusHistory,
  EventTaskAssignHistory, EventSourceKind, EventKind, Task, Reglament, Sensor, Parameter, ParameterValue,
  MeasureType
} from '@projectApp/api/typeClient_pb';
import { CreateEventReq, CreateReglamentReq, CreateTaskReq, SetTaskParameterValueReq, } from '@projectApp/api/serviceClient_pb';
import { Person } from '@projectApp/api/typeGeneral_pb';
import { CreateDocumentReq } from '@projectApp/api/serviceStorage_pb';
import { Document } from '@projectApp/api/typeGeneral_pb';

import { PeriodField } from '@projectApp/api/report/entity/reportField_pb';
import { EventForm } from '@projectApp/api/report/entity/eventForm/form_pb';

export function eventSourceDefault(): EventSource.AsObject {
  return {
    ind: 0,
    caption: '',
    description: '',
    position: '',
    eventsourcekind: {
      ind: 0,
      caption: '',
      description: '',      
      sourcetype: {
        ind: 0,
        caption: '',
        description: '',
        sourceclass: EnumEventSourceClass.EVENT_SOURCE_UNDEFINED,
        sourceclasscaption: '',
      }
    },
    levelmark: {
      ind: 0,
      caption: '',
      description: '',
    },
    digitaxis: {
      ind: 0,
      caption: '',
      description: '',
    },
    letteraxis: {
      ind: 0,
      caption: '',
      description: ''
    },
    room: {
      ind: 0,
      caption: '',
      description: '',
    },
    building: {
      caption: '',
      coordinatesList: [],
      description: '',
      ind: 0,
      monobjectind: 0,
      projectnumber: '',
    }
  }
}

export function parameterValueDefault(): ParameterValue.AsObject {
  return {
    currentstatus: EnumParameterStatus.PARAMETER_STATUS_UNDEFINED,
    datainputtype: EnumDataInputType.DATA_INPUT_TYPE_UNDEFINED,
    personinput: personDefault(),
    value: 0,
    sensor: sensorDefault(),
    timestamp: {
    seconds: 0,
    }
  }
}

export function setTaskParameterValueDefault(): SetTaskParameterValueReq.AsObject{
  return {
    taskind: 0,
    parametervalue: 0,
    personinputind: 0,
    sensorind: 0,
    enumdatainputtype: EnumDataInputType.DATA_INPUT_TYPE_MANUAL,
    timestamp: (new Date()).getTime(),
  }
}

export function measuretypeDefault(): MeasureType.AsObject{
  return {
    caption: '',
    description: '',
    dimension: 0,
    ind: 0,
    parametercaption: '',
    unit: '',
    valuetype: EnumMeasureValueType.MEASURE_VALUE_TYPE_UNDEFINED
  }
}

export function parameterDefault(): Parameter.AsObject {
  return {
    caption:'',
    defaultdatainputtype: EnumDataInputType.DATA_INPUT_TYPE_UNDEFINED,
    description: '',
    ind: 0,
    location: '',
    lastvalue: parameterValueDefault(),
    measuretype: measuretypeDefault(),
  }
}

export function reportEventDefault(): EventForm.AsObject {
  return {    
    personlistList: [],
    buildinglistList: [],
    eventsourceclasslistList: [],

    // eventstatustypefield?: report_entity_reportField_pb.EventStatusTypeField.AsObject,
    // eventclassfield?: report_entity_reportField_pb.EventClassField.AsObject,
    // personlistList: Array<base_entity_entity_pb.Person.AsObject>,
    // buildinglistList: Array<report_entity_eventForm_pb.Building.AsObject>,
    // eventsourceclasslistList: Array<report_entity_eventForm_pb.EventSourceClass.AsObject>,


    // buildingfield?: report_entity_reportField_pb.BuildingField.AsObject,
    // buildinglevelmarkfield?: report_entity_reportField_pb.BuildingLevelMarkField.AsObject,
    // eventstatustypefield?: report_entity_reportField_pb.EventStatusTypeField.AsObject,
    // sensorfield?: report_entity_reportField_pb.SensorField.AsObject,
    // personfield?: report_entity_reportField_pb.PersonField.AsObject,
    // eventclassfield?: report_entity_reportField_pb.EventClassField.AsObject,
  }
}

export function periodFieldDefault(): PeriodField.AsObject{
  return {
    start: Timestamp1Default(),
    end: Timestamp2Default(),
  }
}

export function Timestamp1Default(){
  return {
    seconds: 1652000000
  }
}

export function Timestamp2Default(){
  return {
    seconds: 1662600000
  }
}


export function createTaskDefault(taskClass: EnumTaskClass): CreateTaskReq.AsObject {
  return {
    caption: '',
    description: '',
    eventind: 0,
    eventsourceind: 0,
    performerpersonind: 0,
    reglamentind: 0,
    targetdate: 0,
    taskclass: taskClass,
  }
}

export function createDocumentDefault(): CreateDocumentReq.AsObject {
  return {
    caption: '',
    description: '',
    documentkindind: 0,
    filename: '',
    networklocation: '',
  }
}

export function documentDefault(): Document.AsObject {
  return {
    ind: 0,
    caption: '',
    description: '',
    filename: '',
    networklocation: '',
    favorite: false
  }
}

export function createEventDefault(): CreateEventReq.AsObject {
  return {
    eventkindind: 0,
    messagetext: '',
    sensorind: 0,
    personinputind: 0,
    eventsourceind: 0,
    datainputtype: EnumDataInputType.DATA_INPUT_TYPE_MANUAL,
    timestamp: 0,
    messageid: "",
  }
}

export function taskDefault(): Task.AsObject {
  return {
    caption: '',
    id: '',
    description: '',
    eventsList: [],
    ind: 0,
    situation: EnumTaskSituation.TASK_SITUATION_UNDEFINED,
    status: EnumTaskStatus.TASK_STATUS_UNDEFINED,
    taskclass: EnumTaskClass.TASK_CLASS_UNDEFINED,
    performer:personDefault(),
    reglament: reglamentDefault(),
    eventsource: eventSourceDefault(),
    targetdateexceed: false, 
  }
}
export function personDefault(): Person.AsObject {
  return {
    ind: 0,
    email: '',
    name: '',
    patronymic: '',
    personActive: false,
    phone: '',
    surname: ''
  };
}

export function reglamentDefault(): Reglament.AsObject {
  return {
    activationmode: EnumReglamentActivationMode.REGLAMENT_ACTIVATION_MODE_UNDEFINED,
    active: false,
    caption: '',
    description: '',
    ind: 0,
    periodicity: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_UNDEFINED,
    runtimeminutes: 0,
    responsibleperson: personDefault(),
    eventsourcesList: [], 
    tasksList: [],
  }
}

export function createReglamentDefault(): CreateReglamentReq.AsObject {
  return {
    activationmode: EnumReglamentActivationMode.REGLAMENT_ACTIVATION_MODE_UNDEFINED,
    activationtime: 0,
    active: true,
    documentind: 0,
    caption: '',
    description: '',
    eventsourceindexesList: [],
    periodicity: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_UNDEFINED,
    runtimeminutes: 0,
    measuretypeind: 0,
    resposiblepersonind: 0,
  }
}

export function ReglamentDefault(): Reglament.AsObject {
  return {
    ind: 0,
    tasksList: [],
    caption: '',
    description: '',
    active: false,
    periodicity: 1,
    activationmode: 0,
    runtimeminutes: 0,
    document: {
      caption: '',
      description: '',
      filename: '',
      ind: 0,
      networklocation: '',
      favorite: false
    },
    activationtime: {
      nanos: 0,
      seconds: 0
    },
    measuretype : {
      ind: 0,
      caption: '',
      parametercaption: '',
      description: '',
      unit: '',
      dimension: 0,
      valuetype: 0,
      warningtopvalue: {
        value:0
      },
      criticaltopvalue: {
        value:0
      }
    },
    responsibleperson: personDefault(),
    eventsourcesList: [],    
  }
}


export function eventDefault(): Event.AsObject {
  return {
    ind: 0,
    id: '',
    caption: '',
    status: EnumEventStatus.EVENT_STATUS_UNDEFINED,
    eventkind: {
      caption: '',
      consequences: '',
      description: '',
      ind: 0,
      eventsourcekind: {
        ind: 0,
        caption: '',
        description: '',       
        sourcetype: {
          ind: 0,
          caption: '',
          description: '',
          sourceclass: EnumEventSourceClass.EVENT_SOURCE_UNDEFINED,
          sourceclasscaption: '',
        },
      },
      eventtype: {
        ind: 0,
        caption: '',
        description: '',
        eventclass: EnumEventClass.EVENT_CLASS_UNDEFINED,
      }
    },

    personinput: personDefault(),

    eventsource: {
      ind: 0,
      caption: '',
      description: '',
      position: '',
      eventsourcekind: {
        ind: 0,
        caption: '',
        description: '',       
        sourcetype: {
          ind: 0,
          caption: '',
          description: '',
          sourceclass: EnumEventSourceClass.EVENT_SOURCE_UNDEFINED,
          sourceclasscaption: '',
        }
      },
      levelmark: {
        ind: 0,
        caption: '',
        description: '',
      },
      digitaxis: {
        ind: 0,
        caption: '',
        description: '',
      },
      letteraxis: {
        ind: 0,
        caption: '',
        description: ''
      },
      room: {
        ind: 0,
        caption: '',
        description: '',
      },
      building: {
        ind: 0,
        caption: '',
        coordinatesList: [],
        description: '',
        monobjectind: 0,
        projectnumber: '',
      },
    },
    datainputtype: EnumDataInputType.DATA_INPUT_TYPE_MANUAL,
    sourcesensor: sensorDefault(),
    timestamp: {
      seconds: 0,
    },
    tasksList: [],
  }

}

export function sensorDefault(): Sensor.AsObject {
  return {
    ind: 0,
    caption: '',
  }
}

export function buildingDefault(): BuildingInfo.AsObject {
  return {
    digitaxisList: [],
    letteraxisList: [],
    levelmarksList: [],
    roomsList: [],
  }
}
