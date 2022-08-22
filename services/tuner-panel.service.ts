import { Injectable } from '@angular/core';
import * as grpc_methods from './grpc.methods';
import { Observable } from 'rxjs';
import * as grpcWeb from 'grpc-web';

import {TunerClient} from '@api/TunerServiceClientPb';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { EnumMonthInspectionType } from '@api/SittelleConst_pb';


//  import {EquipoClient} from '@api/EquipoServiceClientPb';

import {
  GetTaskPanelListWithTaskAndGroupRequest,
  GetTaskPanelListWithTaskAndGroupResponse,
  SetTaskTypeToPanelRequest,
  TaskTypeToPanelGroupByPanel,
  Panel,
  EditTaskPanelRequest,
  TaskTypeToPanelType,
  AddPanelToPanelListRequest,
  SetAccountGroupToPanelRequest,
  RemovePanelRequest,
  RemoveCheckAvaliableResourceRequest,
  SetCheckAvaliableResourceRequest,
  AddCheckAvaliableResourceRequest,
  GetCheckAvaliableResourceListRequest,
  GetCheckAvaliableResourceListResponse,
  ScadaType,
  GetOrganizationListRequest,
  GetOrganizationListResponse,
  GetContractListRequest,
  GetContractListResponse,
  AddOrganizationRequest,
  RemoveOrganizationRequest,
  AddContractRequest,
  GetEngineeringSystemTypeListRequest,
  GetEngineeringSystemTypeListResponse,
  SetContractRequest,
  SetOrganizationRequest,
  ContractByMonObj,
  GetEngineeringSystemListRequest,
  GetEngineeringSystemListResponse,
  GetClassListRequest,
  GetClassListResponse,
  GetParamListByClassResponse,
  GetParamListByClassRequest,
  MonObjectEngSystem,
  GetClassObjectListResponse,
  GetClassObjectListRequest,

  // GetEquipmentListRequest,
  // GetEquipmentListResponse,
  // RemoveEquipmentRequest,
  RemoveParamListByClassRequest,

  RemoveClassObjectRequest,
  RemoveClassListRequest,
  RemoveEngineeringSystemRequest,
  // SetEquipmentRequest,

  // AddEquipmentRequest,

  TaskStateToPanelType,
  TaskStateToPanelGroupByPanel,
  SetTaskStateToPanelRequest,
  RemoveMonObjectRequest,
  AddMonObjectRequest,
  SetMonObjectRequest,
  MonObjectFullInfo,
  GetMonObjectFullInfoListRequest,
  GetMonObjectFullInfoListResponse,
  EngineeringSystem,
  AddEngineeringSystemRequest,
  AddMonObjectAndSystemInOneStepRequestNew,
  AddClassListRequest,
  ClassList,
  SetClassListRequest,
  AddParamListByClassRequest,
  ParamListByClass,
  SetParamListByClassRequest,
  AddClassObjectRequest,
  ClassObject,
  SetClassObjectRequest,
  RemoveEngineeringSystemTypeRequest,
  SetEngineeringSystemTypeRequest,
  EngineeringSystemType,
  AddEngineeringSystemTypeRequest
  } from '@api/tuner_pb';
import { id } from '@swimlane/ngx-charts';
import { AccountGroup, TaskState } from '@api/SittelleTypeTask_pb';
import { Company, Contract, MonObjectSystem } from '@api/SittelleTypeOffice_pb';
import { ManualDependentValue, ManualListValue, ManualRequestValue } from '@api/SittelleTypeManual_pb';
import { AddEquipmentInstallationRequest, Equipment, EquipmentInstallation,
  GetEquipmentInstallationListRequest, GetEquipmentInstallationListResponse,
  GetEquipmentStateDictListRequest, GetEquipmentStateDictListResponse, GetEquipmentStatusDictListRequest,
  GetEquipmentStatusDictListResponse, RemoveEquipmentInstallationRequest } from '@api/equipo_pb';
import { DictMonObjectState, DictOwnershipType, DictPremesisType, DictRegion, DictUnitType } from '@api/SittelleTypeDictionary_pb';
import { EnumSystemConst, EnumSystemTaskStatus } from '@api/SittelleConst_pb';
// import { Contract } from '@api/SittelleTypeOffice_pb';
// import { Contract } from '@api/tuner_pb';
// import { Company } from '@api/tuner_pb';
// import { MonObjectSystem } from '@api/tuner_pb';

@Injectable({
  providedIn: 'root'
})
export class TunerPanelService {

  // MONOBJECT_ALL_IND = EnumSystemConst.MONOBJECT_ALL_IND;

  private readonly TunerClient: TunerClient;

  constructor(private Grpc: GrpcService, private authService: AuthService ) {
    if (!this.TunerClient) {
      this.TunerClient = Grpc.TunerClient;
    }
  }

  // datasource
  public DataSource() {
    const req = new GetCheckAvaliableResourceListRequest();

    return new Observable(observer => {
      this.TunerClient.getCheckAvaliableResourceList(req, null,
        (err: grpcWeb.Error, response: GetCheckAvaliableResourceListResponse ) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.scadatypeListList)
        // observer.next(data.scadatypeListList)
        let count = 0;
        const result = [];
        data.scadatypeListList.forEach(el => {
            if(count < data.scadatypeListList.length) {
              result.push({
                    ...el,
                    dirty: false
                  });
              }
              count ++;
        });
        observer.next(result);
      });
    });
  }

  private grpcScadaFromObject(value: ScadaType.AsObject): ScadaType{
    const res = new ScadaType();
    res.setId(grpc_methods.grpcUInt32ValueObject(value.id.value));
    res.setCaption(value.caption);
    res.setUrl(value.url);
    res.setType(value.type);
    res.setCheckinterval(grpc_methods.grpcInt32ValueObject(value.checkinterval.value));
    res.setIsActive(grpc_methods.grpcBoolObject(value.isActive.value));
    res.setListMonobjectInd(value.listMonobjectInd);
    return res;
  }

  SourceAdd(source: ScadaType.AsObject){
    const req = new AddCheckAvaliableResourceRequest();
    req.setScadatype(this.grpcScadaFromObject(source));
    return new Observable(observer => {
      this.TunerClient.addCheckAvaliableResource(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  SourceSet(source: ScadaType.AsObject){
    const req = new SetCheckAvaliableResourceRequest();
    req.setScadatype(this.grpcScadaFromObject(source));
    return new Observable(observer => {
      this.TunerClient.setCheckAvaliableResource(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }

  SourceRemove(ind: number){
    const req = new RemoveCheckAvaliableResourceRequest();
    req.setScadatypeInd(ind);
    return new Observable(observer => {
      this.TunerClient.removeCheckAvaliableResource(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public PanelByInd(panelInd: number) {
    const req = new GetTaskPanelListWithTaskAndGroupRequest();
    return new Observable(observer => {
      this.TunerClient.getTaskPanelListWithTaskAndGroupList(req, null,
        (err: grpcWeb.Error, response: GetTaskPanelListWithTaskAndGroupResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        data.taskpanelWithTaskAndGroupList.forEach(element => {
          if (element.panel.ind === panelInd){
            observer.next(element);
          }
        });
      });
    });
  }

  // get panel list
  PanelList(){
    const req = new GetTaskPanelListWithTaskAndGroupRequest();
    return new Observable(observer => {
      this.TunerClient.getTaskPanelListWithTaskAndGroupList(req, null,
        (err: grpcWeb.Error, response: GetTaskPanelListWithTaskAndGroupResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        let count = 0;
        const result = [];
        data.taskpanelWithTaskAndGroupList.forEach(el => {
            if(count < data.taskpanelWithTaskAndGroupList.length) {
              result.push({
                    ...el,
                    position: 0
                  });
              }
              count ++;
        });
        observer.next(result);
        // observer.next(data.taskpanelWithTaskAndGroupList);
      });
    });
  }

  private grpcPanelFromObject(value: Panel.AsObject): Panel{
    const res = new Panel();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setActive(value.active);
    res.setAccessory(value.accessory);
    res.setDescr(value.descr);
    res.setColumnList(value.columnList);
    res.setImageInd(value.imageInd);
    res.setImageActiveFileName(value.imageActiveFileName);
    res.setImageActiveFile(value.imagePassiveFile);
    res.setImagePassiveFileName(value.imagePassiveFileName);
    res.setImagePassiveFile(value.imagePassiveFile);
    return res;
  }
  PanelSet(panel: Panel.AsObject){

    const req = new EditTaskPanelRequest();

    req.setTaskpanel(this.grpcPanelFromObject(panel));
    // console.log(req.getRole());

    this.TunerClient.editTaskPanel(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      this.authService.mesHandler('Сохранено');
    });
  }
  PanelRemove(panelInd: number){

    const req = new RemovePanelRequest();

    req.setPanelind(panelInd);
    return new Observable(observer => {
      this.TunerClient.removePanel(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  PanelTaskTypeApply(panelInd: number, taskTypeList: TaskTypeToPanelType.AsObject[]){
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', accountGroupList);

    const req = new SetTaskTypeToPanelRequest();


    let addTaskTypeList: Array<TaskTypeToPanelType>;
    addTaskTypeList = new Array(taskTypeList.length);
    for (let i = 0; i < taskTypeList.length; i++ ){
      addTaskTypeList[i] = new TaskTypeToPanelType();
      addTaskTypeList[i].setRootTasktypeInd(taskTypeList[i].rootTasktypeInd);
      addTaskTypeList[i].setTasktypeInd(taskTypeList[i].tasktypeInd);
      addTaskTypeList[i].setStatusInd(taskTypeList[i].statusInd);
      addTaskTypeList[i].setDemand(taskTypeList[i].demand);
      addTaskTypeList[i].setDemandTaskType(taskTypeList[i].demandTaskType);
    }
    let AddPanelList: Array<TaskTypeToPanelGroupByPanel>;
    AddPanelList = new Array(1);
    AddPanelList[0] = new TaskTypeToPanelGroupByPanel();
    AddPanelList[0].setTaskpanelInd(panelInd);
    AddPanelList[0].setTasktypetopanelListList(addTaskTypeList);
    // console.log(AddPanelList);
    req.setPanelList(AddPanelList);
    console.log('TunerRoleService.RoleGlobalAccountGroupApply', req.toObject());

    this.TunerClient.setTaskTypeToPanel(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      this.authService.mesHandler('Сохранено');
    });
  }

  PanelTaskStateApply(panelInd: number, taskstateList: TaskStateToPanelType.AsObject[]){
    console.log('panelInd', panelInd, 'taskstateList', taskstateList);

    const req = new SetTaskStateToPanelRequest();

    let addTaskStateList: Array<TaskStateToPanelType>;
    addTaskStateList = new Array(taskstateList.length);
    for (let i = 0; i < taskstateList.length; i++ ){
      addTaskStateList[i] = new TaskStateToPanelType();
      addTaskStateList[i].setMaskapplytype(taskstateList[i].maskapplytype);
      addTaskStateList[i].setTaskstatetype(taskstateList[i].taskstatetype);
      addTaskStateList[i].setTaskstatevalue(taskstateList[i].taskstatevalue);
    }
    let AddPanel: TaskStateToPanelGroupByPanel;
    // AddPanelList = new Array(1);
    AddPanel = new TaskStateToPanelGroupByPanel();
    AddPanel.setTaskpanelInd(panelInd);
    AddPanel.setTaskstatetopanelListList(addTaskStateList);
    // console.log(AddRoleList);

    req.setPanel(AddPanel);
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', req.toObject());

    this.TunerClient.setTaskStateToPanel(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      this.authService.mesHandler('Сохранено');
    });
  }

  PanelAdd(panel: Panel.AsObject){

    const req = new AddPanelToPanelListRequest();

    req.setPanel(this.grpcPanelFromObject(panel));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addPanelToPanelList(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }


  PanelAccountGroupApply(panelInd: number, accountGroupList: AccountGroup.AsObject[]){
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', accountGroupList);

    const req = new SetAccountGroupToPanelRequest();

    let addAccountGroupList: Array<number>;
    addAccountGroupList = new Array(0);
    accountGroupList.forEach(element => {
      addAccountGroupList.push(element.ind);
    });
    req.setPanelInd(panelInd);
    req.setListAccountgroupIndList(addAccountGroupList);

    this.TunerClient.setAccountGroupToPanel(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      this.authService.mesHandler('Сохранено');
    });
  }

  OrganizationList(errorHandle: boolean = true){

    const req = new GetOrganizationListRequest();


    return new Observable(observer => {
      this.TunerClient.getOrganizationList (req, null, (err: grpcWeb.Error, response: GetOrganizationListResponse) => {
        if (err) {
          if (errorHandle){
            this.authService.errorHandler(err);
          }
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data)
        for (let index = 0; index < data.companyListList.length; index++) {
          if ( data.companyListList[index].inn === undefined){
            data.companyListList[index].inn = {value: 0};
          }
          if (data.companyListList[index].kpp === undefined){
            data.companyListList[index].kpp = {value: 0};
          }
          if (data.companyListList[index].ogrn === undefined){
            data.companyListList[index].ogrn = {value: 0};
          }
          if ( data.companyListList[index].removedata === undefined){
            data.companyListList[index].removedata = {value: 0};
          }
        }
        observer.next(data.companyListList);
      });
    });
  }

  addOrganization(company: Company.AsObject){

    const req = new AddOrganizationRequest();

    req.setDicttype(1);
    req.setCompany(this.grpcCompanyFromObject(company));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addOrganization(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcCompanyFromObject(value: Company.AsObject): Company{
    const res = new Company();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setAddressactual(value.addressactual);
    res.setAddresslegal(value.addresslegal);
    res.setAddresspostal(value.addresspostal);
    res.setEmail(value.email);
    res.setPhone(value.phone);
    res.setChieffullname(value.chieffullname);
    res.setChiefposition(value.chiefposition);
    res.setDescription(value.description);
    res.setInn(grpc_methods.grpcInt64ValueObject(value.inn.value));
    res.setKpp(grpc_methods.grpcInt64ValueObject(value.kpp.value));
    res.setOgrn(grpc_methods.grpcInt64ValueObject(value.ogrn.value));
    res.setActive(grpc_methods.grpcBoolObject(value.active.value));
    res.setRemovedata(grpc_methods.grpcInt64ValueObject(value.removedata.value));
    res.setWebsite(value.website);
    return res;
  }

  setOrganization(company){

    const req = new SetOrganizationRequest();

    req.setDicttype(1);
    // console.log(this.grpcCompanyFromObject(company));
    req.setCompany(this.grpcCompanyFromObject(company));
    return new Observable(observer => {
      this.TunerClient.setOrganization(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }

  EngSystemList(monObjectInd: number, handleError: boolean = true){

    const req = new GetEngineeringSystemListRequest();

    req.setMonobjind(monObjectInd)

    return new Observable(observer => {
      this.TunerClient.getEngineeringSystemList(req, null, (err: grpcWeb.Error, response: GetEngineeringSystemListResponse) => {
        if (err) {
          if (handleError){
            this.authService.errorHandler(err);
          }
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log('engsys', data.engineersystemListList)
        observer.next(data.engineersystemListList);
      });
    });
  }

  removeOrganization(companyInd: number){

    const req = new RemoveOrganizationRequest();

    req.setCompanyInd(companyInd);
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.removeOrganization(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

   ContractList(errorHandle: boolean = true) {

    const req = new GetContractListRequest();

    req.setMonObjectInd(EnumSystemConst.MONOBJECT_ALL_IND);
    req.setSystemInd(EnumSystemConst.ENGINEERING_SYSTEM_ALL_IND);

    return new Observable(observer => {
      this.TunerClient.getContractList(req, null, (err: grpcWeb.Error, response: GetContractListResponse) => {
        if (err) {
          if (errorHandle){
            this.authService.errorHandler(err);
          }
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.contractListList);
      });
    });
  }

  ContractListItem(monObject: number, system: number, errorHandle: boolean = true) {

    const req = new GetContractListRequest();

    req.setMonObjectInd(monObject);
    req.setSystemInd(system);
    return new Observable(observer => {
      this.TunerClient.getContractList(req, null, (err: grpcWeb.Error, response: GetContractListResponse) => {
        if (err) {
          if (errorHandle){
            this.authService.errorHandler(err);
          }
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.contractListList);
      });
    });
  }

  private grpcContractFromObject(value: Contract.AsObject): Contract{
    const res = new Contract();
    res.setInd(value.ind);
    res.setSupplementaryagreement(value.supplementaryagreement);
    res.setActive(grpc_methods.grpcBoolObject(value.active.value));
    res.setDateApply(grpc_methods.grpcInt64ValueObject(value.dateApply.value));
    res.setDateAssign(grpc_methods.grpcInt64ValueObject(value.dateAssign.value));
    res.setDateClose(grpc_methods.grpcInt64ValueObject(value.dateClose.value));
    res.setDescription(value.description);
    res.setListCompanyInd(value.listCompanyInd);
    res.setNumber(value.number);
    return res;
  }
  private grpcContractByMonObjFromObject(value: ContractByMonObj.AsObject): ContractByMonObj{
    const res = new ContractByMonObj();
    res.setContract(this.grpcContractFromObject(value.contract));
    const MonObjectSystemList: Array<MonObjectEngSystem> = [];
    value.listMonobjectSystemList.forEach(element => {
      const item = new MonObjectEngSystem();
      item.setEngineersystemIndList(element.engineersystemIndList);
      item.setMonobjectInd(element.monobjectInd);
      MonObjectSystemList.push(item);
    });
    res.setListMonobjectSystemList(MonObjectSystemList);
    return res;
  }

  ContractAdd(contract: ContractByMonObj.AsObject){

    const req = new AddContractRequest();

    console.log(this.grpcContractByMonObjFromObject(contract));
    req.setContract(this.grpcContractByMonObjFromObject(contract));
    return new Observable(observer => {
      this.TunerClient.addContract(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  ContractSave(contract: ContractByMonObj.AsObject){

    const req = new SetContractRequest();

    console.log(this.grpcContractByMonObjFromObject(contract));
    req.setContract(this.grpcContractByMonObjFromObject(contract));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.setContract(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }

  private grpcengineeringSystemFromObject(value: EngineeringSystemType.AsObject): EngineeringSystemType{
    const res = new EngineeringSystemType();
    res.setCaption(value.caption);
    res.setInd(value.ind);
    res.setCode(value.code);
    res.setIsactive(value.isactive);
    res.setPriority(value.priority);
    res.setIsdefaultsystem(value.isdefaultsystem);
    return res;
  }

  engSystemSet(engineeringSystem){

    const req = new SetEngineeringSystemTypeRequest();

    // console.log(this.grpcengineeringSystemFromObject(engineeringSystem));
    req.setEngineersystemtype(this.grpcengineeringSystemFromObject(engineeringSystem));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.setEngineeringSystemType(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
          return;
        }
        this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }


  getEngineeringSystemList(){

    const req = new GetEngineeringSystemTypeListRequest();


    return new Observable(observer => {
      this.TunerClient.getEngineeringSystemTypeList(req, null, (err: grpcWeb.Error, response: GetEngineeringSystemTypeListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data)
        observer.next(data.engineersystemtypeListList);
      });
    });
  }

  engineeringSystemTypeListRemove(engineeringSystemInd: number){

    const req = new RemoveEngineeringSystemTypeRequest();

    req.setEngineersystemtypeind(engineeringSystemInd);

    return new Observable(observer => {
      this.TunerClient.removeEngineeringSystemType(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {

          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  getClassList(){

    const req = new GetClassListRequest();


    return new Observable(observer => {
      this.TunerClient.getClassList(req, null, (err: grpcWeb.Error, response: GetClassListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log("classListList",data)
        observer.next(data.classListList);
      });
    });
  }

  getModelList(){

    const req = new GetClassObjectListRequest();


    return new Observable(observer => {
      this.TunerClient.getClassObjectList(req, null, (err: grpcWeb.Error, response: GetClassObjectListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log("classListList",data)
        observer.next(data.classobjectlistList);
      });
    });
  }

  getParamClassList(bool: boolean, id: number){

    const req = new GetParamListByClassRequest();

    req.setClasslistind(id);
    req.setIncludeparents(bool);

    return new Observable(observer => {
      this.TunerClient.getParamListByClass(req, null, (err: grpcWeb.Error, response: GetParamListByClassResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log("classparamList",data)
        observer.next(data.paramlistbyclassList);
      });
    });
  }

  MonObjectListRemove(MonObjectInd: number[]){

    const req = new RemoveMonObjectRequest();

    req.setMonobjectIndListList(MonObjectInd);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeMonObject(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  paramClassRemove(param: number){

    const req = new RemoveParamListByClassRequest();

    req.setParamlistind(param);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeParamListByClass(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }



  modelListRemove(modelListind: number){

    const req = new RemoveClassObjectRequest();

    req.setClassobjectind(modelListind);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeClassObject(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  classListRemove(classListind: number){

    const req = new RemoveClassListRequest();

    req.setClasslistind(classListind);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeClassList(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcequipListFromObject(value: Equipment.AsObject): Equipment{
    const res = new Equipment();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setSerialnumber(value.serialnumber);
    res.setDateoflastverification(value.dateoflastverification);
    res.setFirmwareversion(value.firmwareversion);
    res.setEquipmentStatusDictInd(value.equipmentStatusDictInd);
    res.setEquipmentStateDictInd(value.equipmentStateDictInd);
    res.setIsvirtual(value.isvirtual);
    // res.setModelclassobjectlist(value.modelclassobjectlist);
    res.setInventorynumber(value.inventorynumber);
    return res;
  }

  private grpcpremesisFromObject(value: DictPremesisType.AsObject): DictPremesisType{
    const res = new DictPremesisType();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    return res;
  }

  private grpccompanyFromObject(value: MonObjectFullInfo.CompanyType.AsObject): MonObjectFullInfo.CompanyType{
    const res = new MonObjectFullInfo.CompanyType();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    return res;
  }

  private grpcmonobjectstateFromObject(value: DictMonObjectState.AsObject): DictMonObjectState{
    const res = new DictMonObjectState();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    return res;
  }

  private grpcregionFromObject(value: DictRegion.AsObject): DictRegion{
    const res = new DictRegion();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setIsactive(value.isactive);
    return res;
  }

  private grpcunittypeFromObject(value: DictUnitType.AsObject): DictUnitType{
    const res = new DictUnitType();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    return res;
  }

  private grpcownershipFromObject(value: DictOwnershipType.AsObject): DictOwnershipType{
    const res = new DictOwnershipType();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    return res;
  }

  private grpcMonObjectListFromObject(value: MonObjectFullInfo.AsObject): MonObjectFullInfo{
    const res = new MonObjectFullInfo();
    console.log(value)
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setAddress(value.address);
    res.setEmail(value.email);
    res.setIsactive(value.isactive);
    res.setPhone(value.phone);
    res.setId(value.id);
    res.setOpenDate(value.openDate);
    res.setPriority(value.priority);
    res.setIslocal(value.islocal);
    res.setRemovedate(value.removedate);
    res.setSalesArea(value.salesArea);
    res.setTotalArea(value.totalArea);
    res.setOwnership(this.grpcownershipFromObject(value.ownership));
    res.setPremesis(this.grpcpremesisFromObject(value.premesis));
    res.setCompany(this.grpccompanyFromObject(value.company));
    res.setMonobjectstate(this.grpcmonobjectstateFromObject(value.monobjectstate));
    res.setRegion(this.grpcregionFromObject(value.region));
    res.setUnittype(this.grpcunittypeFromObject(value.unittype));

    return res;
  }

  MonObjectListAdd(MonObjectList: MonObjectFullInfo.AsObject){

    const req = new AddMonObjectRequest();

    // console.log(this.grpcContractByMonObjFromObject(equipList));
    req.setMonobject(this.grpcMonObjectListFromObject(MonObjectList));
    return new Observable(observer => {
      this.TunerClient.addMonObject(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public MonObjectListSet(MonObjectList: MonObjectFullInfo.AsObject){
    // console.log("строка",equipList);
    // console.log("строка1",equipList.getEquipment);

    const req = new SetMonObjectRequest();

    req.setMonobject(this.grpcMonObjectListFromObject(MonObjectList));

    this.TunerClient.setMonObject(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return err;
      }
      this.authService.mesHandler('Сохранено');
      return null;
    });
  }

  public MonObjectFullList(): any {

    const req = new GetMonObjectFullInfoListRequest();

    const result = [];
    return new Observable(observer => {
          this.TunerClient.getMonObjectFullInfoList(req, null, (err: grpcWeb.Error, response: GetMonObjectFullInfoListResponse) => {
            if (err) {
              this.authService.errorHandler(err);
              observer.next([]);
              return;
            }
            const data = response.toObject();
            // console.log(data);
            // observer.next(data.monobjectListList);
            let count = 0;
            const result = [];

            data.monobjectListList.forEach(el => {
                if(count < data.monobjectListList.length) {
                  result.push({
                    monobjectList: {
                      ...el.monobjectList,
                      dirty: false,
                    },
                    systembymonobjList: el.systembymonobjList
                  });
                }
                  count ++;
            });
            observer.next(result);
          });
        });
  }

  engineerSystemList(value) {

    const req = new GetEngineeringSystemListRequest();

    req.setMonobjind(value);

    return new Observable(observer => {
      this.TunerClient.getEngineeringSystemList(req, null, (err: grpcWeb.Error, response: GetEngineeringSystemListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log("classparamList",data)
        observer.next(data.engineersystemListList);
      });
    });
  }

  public SystemOnlyList(): any{
    const req = new GetEngineeringSystemTypeListRequest();
    const res: EngineeringSystemType.AsObject[]  = Array() ;
    this.TunerClient.getEngineeringSystemTypeList(req, null,
      (err: grpcWeb.Error, response: GetEngineeringSystemTypeListResponse) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      // console.log('AccountGroupList', data);
      data.engineersystemtypeListList.forEach(element => {
        // if ((!element.accountGroup.canremove.value) || includeSystem){
          // console.log('AccountGroupList', element.accountGroup);
          res.push(element)
        // }
      });
      // console.log('AccountGroupList', res);
      return res;
    });
    return res;
  }


  engineerSystemTypeList(handleError: boolean = true) {
    const req = new  GetEngineeringSystemTypeListRequest();
    return new Observable(observer => {
      this.TunerClient.getEngineeringSystemTypeList(req, null, (err: grpcWeb.Error, response: GetEngineeringSystemTypeListResponse) => {
        if (err) {
          if (handleError){
            this.authService.errorHandler(err);
          }
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log("classparamList",data)
        // observer.next(data.engineersystemtypeListList);
        // console.log(data);
        let count = 0;
        const result = [];
        data.engineersystemtypeListList.forEach(el => {
            if(count < data.engineersystemtypeListList.length) {
              result.push({
                    ...el,
                    needCreateTask: false,
                    needCreateTO: false,
                  });
              }
              count ++;
        });
        observer.next(result);
        // console.log(result);

      });
    });
  }

  EngineeringSystemAdd(system:number[], object: number[]){

    const req = new AddEngineeringSystemRequest();

    req.setInserttomonobjectListList(object);
    req.setEngineersystemtypeindListList(system);
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addEngineeringSystem(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcEngineeringSystemFromObject(value: EngineeringSystem.AsObject): EngineeringSystem{
    const res = new EngineeringSystem();
    res.setInd(value.ind);
    res.setActive(grpc_methods.grpcBoolObject(value.active.value));
    res.setMonobjind(value.monobjind);
    res.setSystemtypeind(value.systemtypeind);

    // ind: number,
    // id: string,
    // caption: string,
    // monobjind: number,
    // systemtypeind?: google_protobuf_wrappers_pb.Int32Value.AsObject,
    // priority?: google_protobuf_wrappers_pb.Int32Value.AsObject,
    // active?: google_protobuf_wrappers_pb.BoolValue.AsObject,

    return res;
  }

  EngineeringSystemCheckedAdd(system: number[], object: number[]){

    const req = new AddEngineeringSystemRequest();

    req.setInserttomonobjectListList(object);
    req.setEngineersystemtypeindListList(system);
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addEngineeringSystem(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err.code);
          return;
        }
        observer.next(true);
      });
    });
  }

  EngineeringSystemTypedAdd(system){

    const req = new AddEngineeringSystemTypeRequest();

    req.setEngineersystemtype(this.grpcEngineeringSystemTypeFromObject(system));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addEngineeringSystemType(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcEngineeringSystemTypeFromObject(value: EngineeringSystemType.AsObject): EngineeringSystemType{
    const res = new EngineeringSystemType();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setCode(value.code);
    res.setIsactive(value.isactive);
    res.setIsdefaultsystem(value.isdefaultsystem);
    res.setPriority(value.priority);
    return res;
  }

  private grpcEngineeringSystemCheckedFromObject(value: EngineeringSystem.AsObject): EngineeringSystem{
    const res = new EngineeringSystem();
    res.setInd(value.ind);
    res.setActive(grpc_methods.grpcBoolObject(value.active.value));
    res.setMonobjind(value.monobjind);
    res.setSystemtypeind(value.systemtypeind);
    return res;
  }

  RemoveEngineeringSystem(Engineersystem: number){

    const req = new RemoveEngineeringSystemRequest();

    req.setEngineersystemind(Engineersystem);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeEngineeringSystem(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  MonObjectAndSystemAdd(
    monobject: MonObjectFullInfo.AsObject,
    taskForMonitoring: boolean,
    taskForForInspection: EnumMonthInspectionType,
    engSystemTypeInd: number[],
    taskArr: number[],
    StartMonth: number,
    StartYear: number,
    EndMonth: number,
    EndTear: number,
    Timezone: string,
    taskArrTO: number[],
    ){
    const req = new AddMonObjectAndSystemInOneStepRequestNew();
    req.setEngineersystemtypeindListList(engSystemTypeInd);
    req.setEngineersystemtypeindTaskListList(taskArr);
    req.setIsaddtaskbymonobject(taskForMonitoring);
    req.setMonobject(this.grpcMonObjectListFromObject(monobject));
    req.setMonthinspectiontype(taskForForInspection);
    req.setMonthofendmonthinspection(EndMonth);
    req.setMonthofstartmonthinspection(StartMonth);
    req.setYearofstartmonthinspection(StartYear);
    req.setYearofendmonthinspection(EndTear);
    req.setTimezone(Timezone);
    req.setEngineersystemtypeindMaintenanceTypeListList(taskArrTO);
    // console.log("зона",Timezone);
    // console.log("мес конец",EndMonth);
    // console.log("мес начало",StartMonth);
    // console.log("год начало",StartYear);
    // console.log("год конец",EndTear);
    return new Observable(observer => {
      this.TunerClient.addMonObjectAndSystemInOneStepNew(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err.code);
          return;
        }
        observer.next(true);
      });
    });
  }

  AddClassList(ClassList){

    const req = new AddClassListRequest();

    req.setClassList(this.grpcClassListFromObject(ClassList));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addClassList(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcClassListFromObject(value: ClassList.AsObject): ClassList{
    const res = new ClassList();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setParentListInd(value.parentListInd);
    res.setRegionCaption(value.regionCaption);
    return res;
  }

  public SetClassList(ClassList){

    const req = new SetClassListRequest();

    req.setClassList(this.grpcClassListFromObject(ClassList));

    this.TunerClient.setClassList(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return err;
      }
      this.authService.mesHandler('Сохранено');
      return null;
    });
  }

  RemoveClassList(ClassListId){

    const req = new RemoveClassListRequest();

    req.setClasslistind(ClassListId);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeClassList(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  AddParamClassList(ParamClassList){

    const req = new AddParamListByClassRequest();

    req.setParamlistbyclass(this.grpcParamClassListFromObject(ParamClassList));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addParamListByClass(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcParamClassListFromObject(value: ParamListByClass.AsObject): ParamListByClass{
    const res = new ParamListByClass();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setClasslistind(value.classlistind);
    res.setAdtypelistind(value.adtypelistind);
    res.setObligatory(value.obligatory);
    res.setAdvaluelisttypeind(value.advaluelisttypeind);
    res.setMasktocheck(value.masktocheck);
    res.setConstlist(value.constlist);
    res.setDefaultvalue(value.defaultvalue);
    res.setDescription(value.description);
    res.setIssystem(value.issystem);
    res.setNullvalue(value.nullvalue);
    res.setParentindlist(value.parentindlist);
    return res;
  }

  public SetParamClassList(ParamClassList){

    const req = new SetParamListByClassRequest();

    console.log(ParamClassList);
    req.setParamlistbyclass(this.grpcParamClassListFromObject(ParamClassList));

    this.TunerClient.setParamListByClass(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return err;
      }
      this.authService.mesHandler('Сохранено');
      return null;
    });
  }

  AddClassObject(ClassObject){

    const req = new AddClassObjectRequest();

    req.setClassobject(this.grpcClassObjectFromObject(ClassObject));
    // console.log(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.addClassObject(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  private grpcClassObjectFromObject(value: ClassObject.AsObject): ClassObject{
    const res = new ClassObject();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setClasslistind(value.classlistind);
    res.setDescription(value.description );
    res.setInstancesClassListInd(value.instancesClassListInd);
    return res;
  }

  public SetObjectClass(ObjectClass){

    const req = new SetClassObjectRequest();

    req.setClassobject(this.grpcClassObjectFromObject(ObjectClass));

    this.TunerClient.setClassObject(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return err;
      }
      this.authService.mesHandler('Сохранено');
      return null;
    });
  }

  RemoveObjectClass(ObjectClass){

    const req = new RemoveClassObjectRequest();

    req.setClassobjectind(ObjectClass);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeClassObject(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

}
