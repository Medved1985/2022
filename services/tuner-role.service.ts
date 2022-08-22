import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as grpcWeb from 'grpc-web';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'

import {TunerClient} from '@api/TunerServiceClientPb';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpc_methods from '@projectApp/services/grpc.methods'
import {
  GetLocalRoleListRequest,
  GetLocalRoleListResponse,
  GetRoleRightsRequest,
  GetRoleRightsResponse,

  GetGlobalRoleListRequest,
  GetGlobalRoleListResponse,
  RightsGroupByRole,

  SetRoleRightsRequest,

  GetRoleNotificationsRequest,
  GetRoleNotificationsResponse,
  RoleNotifyGroupByRole,
  SetRoleNotificationsRequest,

  TaskTypeGroupByRole,

  AddRoleRequest,
  EditRoleRequest,
  GetRoleByIndRequest,
  GetRoleByIndResponse,

  GetTaskTypeListByLocalRoleRequest,
  GetTaskTypeListByLocalRoleResponse,
  SetTaskTypeByLocalRoleRequest,
  TaskTypeToRole,

  GetAccountGroupListByRoleRequest,
  GetAccountGroupListByRoleResponse,

  SetAccountGroupByRoleRequest,

  RemoveRoleRequest,

  GlobalRole, GetRightsConfigurationFullRequest, GetRightsConfigurationFullResponse,
  SetRightsConfigurationRequest, ConfigRightsGroupByRole, RoleConfigRightType
  } from '@api/tuner_pb';
import { RoleRightRequest } from '@api/SittelleServiceMain_pb';
import { RoleNotifyType, RoleRightType } from '@api/SittelleTypeSystem_pb';
import { AccountGroup } from '@api/SittelleTypeTask_pb';
import { DictRightsConfigurationNamesRequest, DictRightsConfigurationNamesRes } from '@api/SittelleServiceDictionary_pb';
import { DictionaryClient } from '@api/SittelleServiceDictionaryServiceClientPb';
import { TRoleRight } from '@projectApp/page/config/rights-administration/rights-administration.component';



@Injectable({
  providedIn: 'root'
})
export class TunerRoleService {
  private readonly TunerClient: TunerClient;
  private readonly DictionaryClient: DictionaryClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.TunerClient) {
      this.TunerClient = Grpc.TunerClient;
    }
  }

  public RoleRights(ind: number){
     
    const req = new GetRoleRightsRequest();
    
    return new Observable(observer => {
      this.TunerClient.getRoleRights(req, null,
        (err: grpcWeb.Error, response: GetRoleRightsResponse) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // let roleIn: any;
        let ress
        data.rightsList.forEach(element => {
          if (element.taskroleInd === ind){
            ress = element.rolerightListList
            // observer.next(ress);
          }
        });
        let count = 0;
        const result = [];
        ress.forEach(el => {
            if(count < ress.length) {
              result.push({               
                    taskroleInd: el.taskroleInd,
                    rootTasktypeInd: el.rootTasktypeInd,
                    tasktypeInd: el.tasktypeInd,
                    statusInd: el.statusInd,
                    right: el.right,
                    accountListList: el.accountListList,
                    monObjectInd: el.monObjectInd,
                    double: 0,                    
                  });
              }
              count ++;
        });
        observer.next(result);
      });
    });
  }
  public RoleRightApply(roleInd: number, rightList: RoleRightType.AsObject[]){     
    const req = new SetRoleRightsRequest();    
    let addRightList: Array<RoleRightType>;
    addRightList = new Array(rightList.length);
    for (let i = 0; i < rightList.length; i++ ){
      addRightList[i] = new RoleRightType();
      addRightList[i].setMonObjectInd(rightList[i].monObjectInd);
      addRightList[i].setRight(rightList[i].right);
      addRightList[i].setRootTasktypeInd(rightList[i].rootTasktypeInd);
      addRightList[i].setTasktypeInd(rightList[i].tasktypeInd);
      addRightList[i].setStatusInd(rightList[i].statusInd);
    }
    let AddRoleList: Array<RightsGroupByRole>;
    AddRoleList = new Array(1);
    AddRoleList[0] = new RightsGroupByRole();
    AddRoleList[0].setTaskroleInd(roleInd);
    AddRoleList[0].setRolerightListList(addRightList);
    // console.log(AddRoleList);
    req.setSetRoleRightsList(AddRoleList);
    return new Observable(observer => {
      this.TunerClient.setRoleRights(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
        return;
        }
        observer.next(true);
        // this.authService.mesHandler('Сохранено');
      });
    })
  }
  public RoleByInd(roleInd: number) {     
    const req = new GetRoleByIndRequest();    
    req.setRoleInd(roleInd);
    // console.log('TunerRoleService.RoleByInd2', roleInd);
    return new Observable(observer => {
    this.TunerClient.getRoleByInd(req, null,
      (err: grpcWeb.Error, response: GetRoleByIndResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.role);
       });
    });

  }

  public RoleNotifications(ind: number){     
    const req = new GetRoleNotificationsRequest();    
    return new Observable(observer => {
      this.TunerClient.getRoleNotifications(req, null,
        (err: grpcWeb.Error, response: GetRoleNotificationsResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        let ress
        data.notifyList.forEach(element => {
          if (element.taskroleInd === ind){
            ress = element.rolenotifyListList            
          }
        });
        let count = 0;
        const result = [];
        ress.forEach(el => {
            if(count < ress.length) {
              result.push({               
                    rootTasktypeInd: el.rootTasktypeInd,
                    tasktypeInd: el.tasktypeInd,
                    statusInd: el.statusInd,
                    monobjectInd: el.monobjectInd,
                    taskroleInd: el.taskroleInd,
                    notify: el.notify,
                    accountListList: el.accountListList,
                    double: 0,                    
                  });
              }
              count ++;
        });
        observer.next(result);

        // data.notifyList.forEach(element => {
        //   if (element.taskroleInd === ind){
        //     observer.next(element.rolenotifyListList);
        //   }
        // });
      });
    });
  }



  public RoleNotificationsApply(roleInd: number, notifyList: RoleNotifyType.AsObject[]){     
    const req = new SetRoleNotificationsRequest();    
    let addNotificationList: Array<RoleNotifyType>;
    addNotificationList = new Array(notifyList.length);
    for (let i = 0; i < notifyList.length; i++ ){
      addNotificationList[i] = new RoleNotifyType();
      addNotificationList[i].setMonobjectInd(notifyList[i].monobjectInd);
      addNotificationList[i].setNotify(notifyList[i].notify);
      addNotificationList[i].setRootTasktypeInd(notifyList[i].rootTasktypeInd);
      addNotificationList[i].setTasktypeInd(notifyList[i].tasktypeInd);
      addNotificationList[i].setStatusInd(notifyList[i].statusInd);
    }
    let AddRoleList: Array<RoleNotifyGroupByRole>;
    AddRoleList = new Array(1);
    AddRoleList[0] = new RoleNotifyGroupByRole();
    AddRoleList[0].setTaskroleInd(roleInd);
    AddRoleList[0].setRolenotifyListList(addNotificationList);
    // console.log(AddRoleList);
    req.setSetRoleNotificationsList(AddRoleList);

    return new Observable(observer => {
      this.TunerClient.setRoleNotifications(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
        return;
        }
        observer.next(true);
        // this.authService.mesHandler('Сохранено');
      });
    })    
  }

  public LocalRoleOnlyList(){     
    const req = new GetLocalRoleListRequest();    
    const res: GlobalRole.AsObject[] = Array() ;
    this.TunerClient.getLocalRoleList(req, null,
      (err: grpcWeb.Error, response: GetLocalRoleListResponse) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      // console.log('AccountGroupList', data);
      data.localRoleList.forEach(element => {
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

  // get local role list
  public RoleLocalList(){     
    const req = new GetLocalRoleListRequest();    
    return new Observable(observer => {
      this.TunerClient.getLocalRoleList(req, null,
        (err: grpcWeb.Error, response: GetLocalRoleListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.localRoleList);
      });
    });
  }

  public RoleLocalTaskTypeList(roleInd: number){     
    const req = new GetTaskTypeListByLocalRoleRequest();    
    req.setLocalroleInd(roleInd);
    return new Observable(observer => {
      this.TunerClient.getTaskTypeListByLocalRole(req, null,
        (err: grpcWeb.Error, response: GetTaskTypeListByLocalRoleResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.tasktypeListList);
      });
    });
  }
  public RoleLocalTaskTypeApply(roleInd: number, typeList: TaskTypeToRole.AsObject[]){     
    const req = new SetTaskTypeByLocalRoleRequest();    
    let addTaskTypeList: Array<TaskTypeToRole>;
    addTaskTypeList = new Array(typeList.length);
    for (let i = 0; i < typeList.length; i++ ){
      addTaskTypeList[i] = new RoleRightType();
      addTaskTypeList[i].setRootTasktypeInd(typeList[i].rootTasktypeInd);
      addTaskTypeList[i].setTasktypeInd(typeList[i].tasktypeInd);
    }
    let AddRoleList: Array<TaskTypeGroupByRole>;
    AddRoleList = new Array(1);
    AddRoleList[0] = new TaskTypeGroupByRole();
    AddRoleList[0].setTaskroleInd(roleInd);
    AddRoleList[0].setTasktypeListList(addTaskTypeList);
    // console.log(AddRoleList);
    req.setSetTasktypeList(AddRoleList);
    this.TunerClient.setTaskTypeByLocalRole(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      this.authService.mesHandler('Сохранено');
    });
  }

  public RoleAdd(role: GlobalRole.AsObject){     
    const req = new AddRoleRequest();    
    req.setRole(this.grpcRoleFromObject(role));
    console.log(role);
    
    return new Observable(observer => {
      this.TunerClient.addRole(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
          return;
        }
        observer.next(true);
      });
    });
  }

  public RoleRemove(roleInd: number){     
    const req = new RemoveRoleRequest();    
    req.setRoleInd(roleInd);
    return new Observable(observer => {
      this.TunerClient.removeRole(req, null,
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

  private grpcRoleFromObject(role: GlobalRole.AsObject): GlobalRole{
    const res = new GlobalRole();
    res.setId(grpc_methods.grpcUInt32ValueObject(role.id.value));
    res.setCaption(role.caption);
    res.setActive(grpc_methods.grpcBoolObject(role.active.value));
    res.setIsTaskRole(grpc_methods.grpcBoolObject(role.isTaskRole.value));
    res.setRegionCaption(role.caption);
    res.setDescription(grpc_methods.grpcStringObject(role.description.value));
    // res.setIsSystemRole(grpc_methods.grpcBoolObject(role.isSystemRole.value));
    // console.log('grpcRoleFromObject', role);
    return res;
  }

  public RoleEdit(role: GlobalRole.AsObject){     
    const req = new EditRoleRequest();    
    req.setRole(this.grpcRoleFromObject(role));
    return new Observable(observer => {
      this.TunerClient.editRole(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
          return;
        }
        observer.next(true);
      });
    });
  }

  public GlobalRoleOnlyList(){     
    const req = new GetGlobalRoleListRequest();    
    const res: GlobalRole.AsObject[] = Array() ;
    this.TunerClient.getGlobalRoleList(req, null,
      (err: grpcWeb.Error, response: GetGlobalRoleListResponse) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      // console.log('AccountGroupList', data);
      data.globalRoleList.forEach(element => {
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

  // get global role lest
  public RoleGlobalList(){     
    const req = new GetGlobalRoleListRequest();    
    return new Observable(observer => {
      this.TunerClient.getGlobalRoleList(req, null,
        (err: grpcWeb.Error, response: GetGlobalRoleListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.globalRoleList);
      });
    });
  }

  public RoleGlobalAccountGroupList(roleInd: number): Array<AccountGroup.AsObject>{     
    const req = new GetAccountGroupListByRoleRequest();    
    const res: Array<AccountGroup.AsObject> = new Array();
      this.TunerClient.getAccountGroupListByRole(req, null,
        (err: grpcWeb.Error, response: GetAccountGroupListByRoleResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          return;
        }
        const data = response.toObject();
        // let roleIn: any;
        data.accountGroupList.forEach(element => {
          if (element.role.id.value === roleInd){
            element.accountGroupListList.forEach(accountGroup => {
              res.push(accountGroup)
            });
          }
        });
      });
    //  console.log('TunerRoleService.RoleGlobalAccountGroupApply', res);
    return res;
  }

  public RoleGlobalAccountGroupApply(roleInd: number, accountGroupList: AccountGroup.AsObject[]){        
    const req = new SetAccountGroupByRoleRequest();    
    let addAccountGroupList: Array<number>;
    addAccountGroupList = new Array(0);
    accountGroupList.forEach(element => {
      addAccountGroupList.push(element.ind);
    });
    req.setTaskroleInd(roleInd);
    req.setListAccountgroupIndList(addAccountGroupList);
    return new Observable(observer => {
      this.TunerClient.setAccountGroupByRole(req, null,
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

  public RoleRightsList(){     
    const req = new GetRightsConfigurationFullRequest();
    return new Observable(observer => {
      this.TunerClient.getRightsConfigurationFull(req, null,
        (err: grpcWeb.Error, response: GetRightsConfigurationFullResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        let count = 0;
        const result = [];
        data.configRightsListList.forEach(el => {
            if(count < data.configRightsListList.length) {
              result.push({
                    taskroleInd: el.taskroleInd,
                    roleconfigrighttypeListList: el.roleconfigrighttypeListList,
                    isSaved: 1,
                  });
              }
              count ++;
        });
        observer.next(result);
      });
    });
  }

  public addConfigurationList(role:TRoleRight){     
    const req = new SetRightsConfigurationRequest();    
    const roleRes:ConfigRightsGroupByRole = new ConfigRightsGroupByRole()
    roleRes.setTaskroleInd(role.role.id.value)
    const roleRes2:Array<RoleConfigRightType> = []
    // console.log(roleRes2)
    for( let i = 0 ; i < role.rightList.length; i++){
      roleRes2[i] = new RoleConfigRightType();
      roleRes2[i].setMonObjectInd(role.rightList[i].system.monObjectInd);
      roleRes2[i].setEngineeringsystemInd(role.rightList[i].system.engineeringsystemInd);
      roleRes2[i].setRight(role.rightList[i].system.right);
    }
    roleRes.setRoleconfigrighttypeListList(roleRes2)
    const res :ConfigRightsGroupByRole[] = [roleRes]
    req.setSetRoleConfigrightsList(res);
    return new Observable(observer => {
      this.TunerClient.setRightsConfiguration(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          this.authService.errorHandler(err);
          return;
        }
        observer.next(true);
      });
    });
  }

  public delConfigurationList(value: number){     
    const req = new SetRightsConfigurationRequest();    
    const rightsObj = new ConfigRightsGroupByRole();
    rightsObj.setTaskroleInd(value)
    rightsObj.setRoleconfigrighttypeListList([])
    const arrRightObj : ConfigRightsGroupByRole[] = [rightsObj]
    req.setSetRoleConfigrightsList(arrRightObj);
    return new Observable(observer => {
      this.TunerClient.setRightsConfiguration(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          this.authService.errorHandler(err);
          return;
        }
        observer.next(true);
      });
    });
  }

}
