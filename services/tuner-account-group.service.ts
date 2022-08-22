import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as grpcWeb from 'grpc-web';

import {TunerClient} from '@api/TunerServiceClientPb';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpc_methods from './grpc.methods';

import {
  GetPersonListRequest,
  GetPersonListResponse,
  EditPersonRequest,
  AddAccountRequest,
  AddAccountGroupRequest,
  RemoveAccountGroupRequest,
  EditAccountGroupRequest,
  EditAccountRequest,
  SetAccountToAccountGroupRequest,
  GetAccountGroupListWithAccountListRequest,
  GetAccountGroupListWithAccountListResponse,
  GetAccountListWithPersonRequest,
  GetAccountListWithPersonResponse,
  RemoveAccountRequest,
  TunerAppInfoRequest,
  TunerAppInfoRes,
  AddAccountToAccountGroupRequest,
  RemoveAccountFromAccountGroupNewRequest

  } from '@api/tuner_pb';
import { Account, AccountGroup, AccountGroupWithAccount, Person } from '@api/SittelleTypeTask_pb';

@Injectable({
  providedIn: 'root'
})
export class TunerAccountGroupService {

  private readonly TunerClient: TunerClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.TunerClient) {
      this.TunerClient = Grpc.TunerClient;
    }
  }

  private grpcAccountFromObject(account: Account.AsObject): Account{
    const res = new Account();
    // @ts-ignore
    res.setInd(grpc_methods.grpcUInt32ValueObject(account.ind));
    res.setCaption(account.caption);
    res.setPassword(account.password);
    res.setActive(account.active);
    res.setEmailActive(account.emailActive);
    res.setPhoneActive(account.phoneActive);
    res.setAccountPerson(this.grpcPersonFromObject(account.accountPerson));
    return res;
  }

  private grpcAccountGroupFromObject(accountGroup: AccountGroup.AsObject): AccountGroup{
    const res = new AccountGroup();
    res.setInd(accountGroup.ind);
    res.setParentInd(accountGroup.parentInd);
    res.setCaption(accountGroup.caption);
    res.setActive(accountGroup.active);
    res.setDescr(accountGroup.descr);
    res.setCanRemove(accountGroup.canRemove);
    res.setCountdayspassword(accountGroup.countdayspassword);
    res.setLengthpassword(accountGroup.lengthpassword);
    return res;
  }

  private grpcPersonFromObject(person: Person.AsObject): Person{
    const res = new Person();
    res.setPersonInd(person.personInd);
    res.setName(person.name);
    res.setSurname(person.surname);
    res.setPatronymic(person.patronymic);
    res.setEmail(person.email);
    res.setPhone(person.phone);
    res.setPersonActive(person.personActive);
    // console.log('res',res)
    return res;
  }

  public AccountList(){     
    const req = new GetAccountListWithPersonRequest();    
    return new Observable(observer => {
      this.TunerClient.getAccountListWithPerson(req, null,
        (err: grpcWeb.Error, response: GetAccountListWithPersonResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.accountListList);
      });
    });
  } 

  public GroupOnlyList(): any{     
    // const req = new GetAccountGroupListWithAccountListRequest();    
    // return new Observable(observer => {
    //   this.TunerClient.getAccountGroupListWithAccountList(req, null, (err: grpcWeb.Error,
    //     response: GetAccountGroupListWithAccountListResponse) => {
    //     if (err) {
    //       this.authService.errorHandler(err);
    //       observer.next([]);
    //       return;
    //     }
    //     const data = response.toObject();
    //     // console.log(data.taskTypeListList);
    //     observer.next(data.accountGroupWithAccountList);
    //   });
    // });
    const req = new GetAccountGroupListWithAccountListRequest();    
    const res: AccountGroupWithAccount.AsObject[]  = Array() ;
    this.TunerClient.getAccountGroupListWithAccountList(req, null,
      (err: grpcWeb.Error, response: GetAccountGroupListWithAccountListResponse) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      // console.log('AccountGroupList', data);
      data.accountGroupWithAccountList.forEach(element => {
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

  public AccountOnlyList(): Account.AsObject[]{     
    const req = new GetAccountListWithPersonRequest();    
    const res: Account.AsObject[] = Array() ;
    this.TunerClient.getAccountListWithPerson(req, null,
      (err: grpcWeb.Error, response: GetAccountListWithPersonResponse) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      // console.log('AccountGroupList', data);
      data.accountListList.forEach(element => {
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

  public AccountAdd(account: Account.AsObject){     
    const req = new AddAccountRequest();    
    req.setAccount(this.grpcAccountFromObject(account));
    // req.set Person(this.grpcPersonFromObject(account.accountPerson));
    return new Observable(observer => {
      this.TunerClient.addAccount(req, null,
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

  public AccountSet(account: Account.AsObject){     
    const req = new EditAccountRequest();    
    req.setAccount(this.grpcAccountFromObject(account));    
    return new Observable(observer => {
      this.TunerClient.editAccount(req, null,
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

  AccountRemove(AccountInd: number){     
    const req = new RemoveAccountRequest();    
    req.setAccountind(AccountInd);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.TunerClient.removeAccount(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          // this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public AccountGroupListAsObject(): any{     
    const req = new GetAccountGroupListWithAccountListRequest();    
    return new Observable(observer => {
      this.TunerClient.getAccountGroupListWithAccountList(req, null, (err: grpcWeb.Error,
        response: GetAccountGroupListWithAccountListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.taskTypeListList);
        observer.next(data.accountGroupWithAccountList);
      });
    });
  }

  public AccountGroupList(includeSystem: boolean): AccountGroup.AsObject[]{     
    const req = new GetAccountGroupListWithAccountListRequest();    
    const res: AccountGroup.AsObject[] = Array() ;
    this.TunerClient.getAccountGroupListWithAccountList(req, null,
      (err: grpcWeb.Error, response: GetAccountGroupListWithAccountListResponse) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      const data = response.toObject();
      // console.log('AccountGroupList', data);
      data.accountGroupWithAccountList.forEach(element => {
        // if ((!element.accountGroup.canremove.value) || includeSystem){
          // console.log('AccountGroupList', element.accountGroup);
          res.push(element.sett)
        // }
      });
      // console.log('AccountGroupList', res);
      return res;
    });
    return res;
  }

  public AccountGroupListWithAccount(includeSystem: boolean){     
    const req = new GetAccountGroupListWithAccountListRequest();    
    return new Observable(observer => {
      this.TunerClient.getAccountGroupListWithAccountList(req, null,
        (err: grpcWeb.Error, response: GetAccountGroupListWithAccountListResponse) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        const anyKey = 'по умолчанию'
        data.accountGroupWithAccountList.forEach(element => {
          if (element.sett.countdayspassword === 0){
          //@ts-ignore
            element.sett.countdayspassword = anyKey
          }
          if (element.sett.lengthpassword === 0){
            //@ts-ignore
              element.sett.lengthpassword = anyKey
            }
        });
         observer.next(data.accountGroupWithAccountList);
        // console.log(this.constructor.name, "AccountGroupListWithAccount", data.accountGroupWithAccountList);
      });
    });
  }

  public AccountGroupAccountList(accountGroupInd: number){     
    const req = new GetAccountGroupListWithAccountListRequest();    
    return new Observable(observer => {
      this.TunerClient.getAccountGroupListWithAccountList(req, null,
        (err: grpcWeb.Error, response: GetAccountGroupListWithAccountListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        data.accountGroupWithAccountList.forEach(element => {
          if (element.sett.ind === accountGroupInd){
            observer.next(element.accountListList);
          }
        });
      });
    });
  }

  public AccountGroupAccountSet(accountGroupInd: number, accountList: Array<number>){
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', accountGroupList);     
    const req = new SetAccountToAccountGroupRequest();    
    req.setAccountGroupInd(accountGroupInd);
    let addAccountList: Array<number>;
    addAccountList = new Array(0);
    accountList.forEach(element => {
      addAccountList.push(element);
    });
    req.setAccountIndListList(addAccountList);
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', req.toObject());
    this.TunerClient.setAccountToAccountGroup(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        // console.log(err);
        this.authService.errorHandler(err);
        return;
      }
      this.authService.mesHandler('Сохранено');
    });
  }

  public AccGrAccListSet(accountGroupInd: Array<number>, accountList: Array<number>){
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', accountGroupList);     
    const req = new AddAccountToAccountGroupRequest();    
    req.setAccountgroupindlistList(accountGroupInd);   
    req.setAccountindlistList(accountList);    
    return new Observable(observer => {
      this.TunerClient.addAccountToAccountGroup(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
          return;
        }
        // this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }

  public AccGrAccListDel(accountGroupInd: Array<number>, accountList: Array<number>){
    // console.log('TunerRoleService.RoleGlobalAccountGroupApply', accountGroupList);     
    const req = new RemoveAccountFromAccountGroupNewRequest();    
    req.setAccountgroupindlistList(accountGroupInd);   
    req.setAccountindlistList(accountList);   
    return new Observable(observer => {
      this.TunerClient.removeAccountFromAccountGroupNew(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          // this.authService.errorHandler(err);
          observer.next(err);
          return;
        }
        // this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }

  public AccountGroupSet(accountGroup: AccountGroup.AsObject){
    const req = new EditAccountGroupRequest();    
    req.setAccountgroup(this.grpcAccountGroupFromObject(accountGroup));
    return new Observable(observer => {
      this.TunerClient.editAccountGroup(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        // this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });    
  }  

  public AccountGroupAdd(accountGroup: AccountGroup.AsObject){     
    const req = new AddAccountGroupRequest();    
    req.setAccountGroup(this.grpcAccountGroupFromObject(accountGroup));
    return new Observable(observer => {
      this.TunerClient.addAccountGroup(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        // this.authService.mesHandler('Сохранено');
        observer.next(true);
      });
    });
  }

  public AccountGroupRemove(accountGroup){     
    const req = new RemoveAccountGroupRequest();    
    req.setAccountGroupInd(accountGroup);
    return new Observable(observer => {
    // console.log('TunerAccountGroupService.AccountGroupRemove', this.grpcAccountGroupFromObject(accountGroup));
      this.TunerClient.removeAccountGroup(req, null,
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

  public PersonList(){     
    const req = new GetPersonListRequest();
    return new Observable(observer => {
      this.TunerClient.getPersonList(req, null,
        (err: grpcWeb.Error, response: GetPersonListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.personListList);
      });
    });
  }

  public PersonSet(person: Person.AsObject){     
    const req = new EditPersonRequest();    
    req.setPerson(this.grpcPersonFromObject(person));
    // console.log(this.constructor.name, 'PersonSet', req);
    return new Observable(observer => {
      this.TunerClient.editPerson(req, null,
        (err: grpcWeb.Error, response: null) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  GetTunerInfo() {     
    const req = new TunerAppInfoRequest();
    return new Observable(observer => {
      this.TunerClient.tunerAppInfo(req, null, (err: grpcWeb.Error, response: TunerAppInfoRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.appInfo);
      });
    });
  }

}
