import {Inject, Injectable} from '@angular/core';
import {CookieService} from './cookie.service';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {
  ExternalConnectionCloseRequest,
  ExternalConnectionCloseRes,
  ExternalConnectionCreateRequest,
  ExternalConnectionCreateRes,
  ExternalRestoreSessionRequest,
  ExternalRestoreSessionRes
} from '@api/SittelleServiceClient_pb';
import * as grpcWeb from 'grpc-web';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import {GrpcService} from './grpc.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {
  AccountChangePasswordRequest, AccountChangePasswordRes,
  AccountPasswordInfoRequest,
  AccountPasswordInfoRes,
  ConnectionRightsRequest,
  ConnectionRightsRes, GeneratePasswordRequest, GeneratePasswordRes,
  GetClientManualParamListRes,
  GetClientManualParamRequest
} from '@api/SittelleServiceAuthorization_pb';
import {interval, Observable} from 'rxjs';
import {
  EnumAccountStatus,
  EnumAdministrationRight,
  EnumAuthorizationResult,
  EnumConfigureRight
} from '@api/SittelleConst_pb';
import {AuthorizationClient} from '@api/SittelleServiceAuthorizationServiceClientPb';
import {CONST_AUTHENTICATION_ERROR, isConnectError, isCorrectSessionType, TAuthRecord} from '../common/common-types';
import {FormBuilder} from '@angular/forms';
import {Account} from '@api/SittelleTypeTask_pb';
import {SystemService} from '@projectApp/services/system/system.service'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ClientServiceClient: ClientServiceClient;
  private readonly AuthorizationClient: AuthorizationClient;
  private EnumConfigureRight: EnumConfigureRight;
  private EnumAdministrationRight: EnumAdministrationRight;
  private showedError = false;
  showed = null;
  sub: any = null;
  tryRestoreForm: NzModalRef;
  tplModalButtonLoading = true;
  FIRST_PASSWORD = EnumAuthorizationResult.FIRST_PASSWORD;
  First: any;
  // password: any;
  // AuthorizationClient: any;

  constructor(private cookie: CookieService, @Inject(LOCAL_STORAGE) private storage: StorageService, private Grpc: GrpcService,
              private modalService: NzModalService, private formBuilder: FormBuilder, private systemService: SystemService,
  ) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
    if (!this.AuthorizationClient) {
      this.AuthorizationClient = Grpc.AuthorizationClient;
    }

    this.First = this.cookie.get('authorizationType')
    // console.log(First);
    // if (this.FIRST_PASSWORD == this.First) {
    //   console.log("da");
    // }

  }

  public checkSaved() {
    return !!(this.cookie.get('sid') && this.cookie.get('cid'))
  }

  public check() {
    let authorizationType: number = Number(EnumAuthorizationResult.INCORRECT_PASSWORD)
    if (this.cookie.get('authorizationType')) {
      authorizationType = Number(this.cookie.get('authorizationType'))
    }
    return !!(this.cookie.get('sid') && this.cookie.get('cid')) && isCorrectSessionType(authorizationType);
  }

  public getSess(): { sid: string; cid: string | number; authorizationType: string | number } {
    return {
      sid: this.cookie.get('sid') || '',
      cid: this.cookie.get('cid') || 0,
      authorizationType: this.cookie.get('authorizationType') || Number(EnumAuthorizationResult.INCORRECT_PASSWORD),
    };
  }

  public getUser(): Account.AsObject {
    let res: Account.AsObject = {
      active: EnumAccountStatus.ACTIVE,
      caption: '',
      emailActive: false,
      ind: 0,
      isrestoresession: true,
      password: '',
      phoneActive: true,
      timesession: 0,
      accountPerson: {
        email: '',
        name: '',
        patronymic: '',
        personActive: true,
        personInd: 0,
        phone: '',
        surname: '',
      },
    };
    if (this.cookie.get('user')) {
      res = JSON.parse(this.cookie.get('user') || '[]')
    }
    return res;
  }

  public setSess(data: TAuthRecord) {
    // console.log(data);
    this.cookie.set('sid', data.SessId);
    this.cookie.set('cid', data.ConnectionInd);
    this.cookie.set('Remember', data.Remember);
    this.cookie.set('user', JSON.stringify(data.accountSettings));
    this.cookie.set('authorizationType', data.authorizationType);
    // this.storage.set('user1', this.password );
    window.location.reload();
  }

  public deleteSess() {
    this.authClear();
    window.location.href = '/login';
  }

  public logout() {
    const sess = this.getSess();
    const req = new ExternalConnectionCloseRequest();


    this.ClientServiceClient.externalConnectionClose(req, null, (err: grpcWeb.Error, response: ExternalConnectionCloseRes) => {
      console.log(response, err);
      this.deleteSess();
    });
  }

  private showError(err) {
    if (this.showedError) {
      return;
    }
    this.showedError = true;
    this.modalService.error({
      nzMask: false,
      nzClosable: false,
      nzTitle: `Error #${err.code}`,
      nzContent: `${err.message}`,
      nzOnOk: () => {
        this.showedError = false;
      }
    });
  }

  private showMes(mes) {
    if (this.showedError) {
      return;
    }
    this.showedError = true;
    this.modalService.success({
      nzMask: false,
      nzClosable: false,
      nzTitle: `Действие`,
      nzContent: `Сохранено`,
      nzOnOk: () => {
        this.showedError = false;
      }
    });
  }

  public mesHandler(mes) {
    console.error(mes);
    this.showMes(mes);
  }

  public closeRestoreSession() {
    this.sub.unsubscribe();
    this.sub = null;
    this.tryRestoreForm.close();
  }

  public authClear() {
    this.cookie.delete('sid');
    this.cookie.delete('cid');
    this.cookie.delete('Remember');
    this.cookie.delete('user');
    this.cookie.delete('authorizationType');
    this.storage.clear();
  }

  public errorHandler(err) {
    console.error(err);
    // error code 2  services connection error
    if (isConnectError(err)) {
      const restore = this.cookie.get('Remember') || false
      const sid = this.cookie.get('sid') || ''
      const cid = this.cookie.get('cid') || 0
      if (sid && cid && !this.sub && restore) {
        // if (restore && sid && cid  && this.sub) {
        this.tryRestoreForm = this.modalService.create({
          nzTitle: 'Потеряна связь с сервером',
          nzContent: 'Идет попытка подключения...',
          nzFooter: null
          // nzFooter: [{
          //   label: 'Закрыть',
          //   shape: 'round'
          // }]
        });
        this.sub = interval(10000).subscribe((val) => {
          if (this.sub) {
            console.log('try connect');
            this.restoreSession().subscribe(data => {
              // console.log("актив магаз",data);
              console.log(data);
              if ((data as grpcWeb.Error).code) {
                if (isConnectError(data)) {
                  console.log('error connect', data);
                } else {
                  this.closeRestoreSession();
                  if (Number(err.code) === CONST_AUTHENTICATION_ERROR) {
                    this.authClear();
                    window.location.href = '/login';
                  }
                }
              } else {
                this.closeRestoreSession();
                let response: ExternalRestoreSessionRes.AsObject;
                response = data as ExternalRestoreSessionRes.AsObject;
                const AuthRecord: TAuthRecord = {
                  ConnectionInd: 0, Remember: false, SessId: '',
                  authorizationType: EnumAuthorizationResult.INCORRECT_PASSWORD
                };
                // console.log(response);
                AuthRecord.Remember = true
                AuthRecord.SessId = response.sessId
                AuthRecord.ConnectionInd = response.connectionInd
                AuthRecord.accountSettings = response.accountSettings
                AuthRecord.authorizationType = EnumAuthorizationResult.SUCCESS
                this.setSess(AuthRecord);
                if (this.FIRST_PASSWORD == this.First) {
                  console.log("FIRST_PASSWORD");
                } else {
                  this.systemService.updateDictionary(response.sessId);
                }

              }
            });
          }
        });
      }
    } else if (Number(err.code) === CONST_AUTHENTICATION_ERROR) {
      if ((window.location.pathname.indexOf('/login') === -1) && (window.location.pathname !== '/')) {
        this.authClear();
        console.log(window.location.pathname);
        window.location.reload();
      }
      // console.log(err);
      // console.log(window.location.pathname);
      // this.authClear();
      // if ((window.location.pathname.indexOf('/login') === -1)){
      //   window.location.reload();
      // }
      // if (window.location.pathname === '/'){
      //   window.location.href = '/login';
      // }
    } else {
      if (err.message === 'Uncorrect role list') {
        err.message = 'Не назначены роли'
      }
      this.showError(err);
    }
  }

  public connectionRight() {
    const sess = this.getSess();
    const req = new ConnectionRightsRequest();

    // console.log("GUID",sess.sid);

    return new Observable(observer => {
      this.AuthorizationClient.connectionRights(req, null,
        (err: grpcWeb.Error, response: ConnectionRightsRes) => {
          if (err) {
            this.errorHandler(err);
            observer.next([]);
            return;
          }
          const data = response.toObject();
          observer.next(data.connectionRightResult);
        });
    });
  }

  public restoreSession() {
    const sess = this.getSess();
    const req = new ExternalRestoreSessionRequest();

    // console.log("GUID",sess.sid);

    return new Observable(observer => {
      this.ClientServiceClient.externalRestoreSession(req, null,
        (err: grpcWeb.Error, response: ExternalRestoreSessionRes) => {
          if (err) {
            this.errorHandler(err);
            observer.next(err);
            return;
          }
          const data = response.toObject();
          observer.next(data);

          if (this.FIRST_PASSWORD == this.First) {
            console.log("FIRST_PASSWORD");
          } else {
            this.systemService.updateDictionary(data.sessId);
          }

          // this.systemService.updateDictionary(data.sessId);
        });
    });
  }

  public connectionCreate(user, pass, bool) {
    const sess = this.getSess();
    const req = new ExternalConnectionCreateRequest();
    req.setUser(user);
    req.setPassword(pass);
    // req.setClientId(pass);
    req.setIsrestoresession(bool);
    // console.log("GUID",sess.sid);

    return new Observable(observer => {
      this.ClientServiceClient.externalConnectionCreate(req, null,
        (err: grpcWeb.Error, response: ExternalConnectionCreateRes) => {
          if (err) {
            this.errorHandler(err);
            observer.next([]);
            return;
          }
          const data = response.toObject();
          console.log("connectionCreate", data);
          observer.next(data);
          if (this.FIRST_PASSWORD == this.First) {
            console.log("FIRST_PASSWORD");
          } else {
            this.systemService.updateDictionary(data.sessId);
          }
          // this.systemService.updateDictionary(data.sessId);
          // this.systemService.updateDictionary(data.authorizationType);
        });
    });
  }

  public changePassword(ind, old, newPass, confirmnewpass) {
    const sess = this.getSess();
    const req = new AccountChangePasswordRequest();

    req.setAccountind(ind);
    req.setOldpassword(old);
    req.setNewpassword(newPass);
    req.setConfirmnewpassword(confirmnewpass);
    console.log(req);
    return new Observable(observer => {
      this.AuthorizationClient.accountChangePassword(req, null,
        (err: grpcWeb.Error, response: AccountChangePasswordRes) => {
          if (err) {
            console.log(err);
            // this.errorHandler(err);
            observer.next(false);
            return;
          }
          const data = response.toObject();
          observer.next(true);
        });
    });
  }

  public generatePassword(ind) {
    const req = new GeneratePasswordRequest();
    req.setAccountInd(ind)
    return new Observable(observer => {
      this.AuthorizationClient.generatePassword(req, null,
        (err: grpcWeb.Error, response: GeneratePasswordRes) => {
          if (err) {
            console.log(err);
            // this.errorHandler(err);
            observer.next(false);
            return;
          }
          const data = response.toObject();
          observer.next(data.password);
        }
      )
    });
  }

  public generateInfo(ind) {
    const req = new AccountPasswordInfoRequest();
    req.setAccountInd(ind)
    return new Observable(observer => {
      this.AuthorizationClient.accountPasswordInfo(req, null,
        (err: grpcWeb.Error, response: AccountPasswordInfoRes) => {
          if (err) {
            // console.log(err);
            // this.errorHandler(err);
            observer.next(err);
            return;
          }
          const data = response.toObject();
          observer.next(data.passwordInfo);
        }
      )
    });
  }

  public connectionData() {
    const sess = this.getSess();
    const req = new GetClientManualParamRequest();
        // console.log("GUID",sess.sid);
    return new Observable(observer => {
      this.AuthorizationClient.getClientManualParam(req, null,
        (err: grpcWeb.Error, response: GetClientManualParamListRes) => {
          if (err) {
            this.errorHandler(err);
            observer.next([]);
            return;
          }
          const data = response.toObject();
           console.log("connectionCreate",data);
          observer.next(data);
          // this.systemService.updateDictionary(data.authorizationType);
        });
    });
  }

}
