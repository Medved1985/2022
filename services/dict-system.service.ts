import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {Observable, from} from 'rxjs';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {DictStatusListRequest, DictStatusListRes,
  DictMonObjectInfoListRequest, DictMonObjectInfoListRes,
  DictTaskTypeListRequest, DictTaskTypeListRes,
  DictStatusGroupListRequest, DictStatusGroupListRes, DictMonObjectListRequest,  DictMonObjectListRes,
  DictStateTypeListRequest, DictStateTypeListRes, DictAccountStatusListRequest, DictAccountStatusListRes,
  DictRegionListRequest, DictRegionListRes, DictUnitTypeListRequest, DictUnitTypeListRes,
  DictMonObjectStateListRes, DictOwnershipTypeListRequest, DictOwnershipTypeListRes, DictPremesisTypeListRequest,
  DictPremesisTypeListRes, DictMonthInspectionTypeListRequest, DictMonthInspectionTypeListRes,
  DictRightsConfigurationNamesRequest, DictRightsConfigurationNamesRes, DictAdTypeListRequest,
  DictAdTypeListRes, DictAdValueListTypeRequest, DictAdValueListTypeRes,
  RoleInfoListRes, RoleInfoListRequest,
  ManualInfoListRequest, ManualInfoListRes, MaintenanceTypeListRequest, MaintenanceTypeListRes,
  } from '@api/SittelleServiceDictionary_pb';
import {MonObjectShort, DictTaskTypeSett, DictStatus} from '@api/SittelleTypeDictionary_pb'

@Injectable({
  providedIn: 'root'
})
export class DictSystemService {

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryClient) {
      this.DictionaryClient = Grpc.DictionaryServiceClient;
    }
  }

  private readonly DictionaryClient: DictionaryClient;
  private items = [];

  private static dec2hexString(dec) {
    return '#' + dec.toString(16).padStart(6, '0').toLowerCase();
  }

  public ManualParamList(){
    const sess = this.authService.getSess();
    const req = new ManualInfoListRequest();

    return new Observable(observer => {
      this.DictionaryClient.manualInfoList(req, null, (err: grpcWeb.Error, response: ManualInfoListRes) => {
        if (err) {
          console.log(req.toObject())
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.taskTypeListList);
        observer.next(data.listList);
      });
    });
  }
  public ManualParamListSynch():any {
    const sess = this.authService.getSess();
    const req = new ManualInfoListRequest();

    const result = [];
    this.DictionaryClient.manualInfoList(req, null, (err: grpcWeb.Error, response: ManualInfoListRes) => {
        // console.log(response.toObject(), err);
      if (err) {
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      return data.listList

    });
    return [];
  }

  public StatusList(): any{
    const sess = this.authService.getSess();
    const req = new DictStatusListRequest();

      const result = [];
      this.DictionaryClient.dictStatusList(req, null, (err: grpcWeb.Error, response: DictStatusListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          return;
        }
        const data = response.toObject();
        data.statusListList.forEach(e => {
          // result[e.ind] = {
          //   ind: e.ind,
          //   colorBackground: DictSystemService.dec2hexString(e.colorBackground),
          //   caption: e.captionStatus,
          //   isGroup: e.isGroup,
          //   taskTypeInd: e.taskTypeInd
          // };
          result.push({
              ind: e.ind,
              colorBackground: DictSystemService.dec2hexString(e.colorBackground),
              caption: e.captionStatus,
              isGroup: e.isGroup,
              taskTypeInd: e.taskTypeInd
            });
        });

      });
      return result;
  }

  public MaintenanceTypeList(): any{
    const req = new MaintenanceTypeListRequest();
    return new Observable(observer => {
      this.DictionaryClient.maintenanceTypeList(req, null, (err: grpcWeb.Error, response: MaintenanceTypeListRes) => {
        if (err) {
          console.log(req.toObject())
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.taskTypeListList);
        observer.next(data.listList);
      });
    });
  }

  public RoleListAsObject(): any{
    const sess = this.authService.getSess();
    const req = new RoleInfoListRequest();

    return new Observable(observer => {
      this.DictionaryClient.roleInfoList(req, null, (err: grpcWeb.Error, response: RoleInfoListRes) => {
        if (err) {
          console.log(req.toObject())
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.taskTypeListList);
        observer.next(data.listList);
      });
    });
  }

  public GetConfigurationList() : any{
    // console.log('data');
    const sess = this.authService.getSess();
    const req = new DictRightsConfigurationNamesRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictRightsConfigurationNames(req, null,
        (err: grpcWeb.Error, response: DictRightsConfigurationNamesRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.configurationNamesListList);
      });
    });
  }

  public StatusListAsObject(): any{
    const sess = this.authService.getSess();
    const req = new DictStatusListRequest();

    return new Observable(observer => {
      this.DictionaryClient.dictStatusList(req, null, (err: grpcWeb.Error, response: DictStatusListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.taskTypeListList);
        observer.next(data.statusListList);
      });
    });
  }

  public MonObjectList():any {
    const sess = this.authService.getSess();
    const req = new DictMonObjectInfoListRequest();

    const result = [];
    this.DictionaryClient.dictMonObjectInfoList(req, null, (err: grpcWeb.Error, response: DictMonObjectInfoListRes) => {
        // console.log(response.toObject(), err);
      if (err) {
        this.authService.errorHandler(err);
        return;
      }
      const data = response.toObject();
      // this.items = data.monObjectListList;
      // observer.next(data.monObjectListList);
      data.monObjectListList.forEach(e => {
        result.push({ind: e.monObjectInd, caption: e.caption});
      });
    });
    return result;
  }
  public MonObjectListAsObject(onlyActive: boolean): any {
    const sess = this.authService.getSess();
    const req = new DictMonObjectListRequest();

    return new Observable(observer => {
      this.DictionaryClient.dictMonObjectList(req, null, (err: grpcWeb.Error, response: DictMonObjectListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        if (!onlyActive){
        observer.next(data.monObjectListList);
        } else {
          const res: MonObjectShort.AsObject[] = []
          data.monObjectListList.forEach(element => {
            if (element.active){
              res.push(element)
            }
          });
          observer.next(res);
        }
      });
    });
  }

  public TaskTypeList(): any {
    const sess = this.authService.getSess();
    const req = new DictTaskTypeListRequest();

    const result = [];
    this.DictionaryClient.dictTaskTypeList(req, null, (err: grpcWeb.Error, response: DictTaskTypeListRes) => {
      if (err) {
        this.authService.errorHandler(err);
        return;
     }
      const data = response.toObject();
      // console.log(data.taskTypeListList);
      data.taskTypeListList.forEach(e => {
        result.push({ind: e.ind, caption: e.captionRegion});
      });
    });
    return result;
  }
  public TaskTypeListAsObject(): any {
    const sess = this.authService.getSess();
    const req = new DictTaskTypeListRequest();

    return new Observable(observer => {
      this.DictionaryClient.dictTaskTypeList(req, null, (err: grpcWeb.Error, response: DictTaskTypeListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data.taskTypeListList);
        observer.next(data.taskTypeListList);
      });
    });
  }

  public TaskStateListAsObject(): any {
    const sess = this.authService.getSess();
    const req = new DictStateTypeListRequest();

    return new Observable(observer => {
      this.DictionaryClient.dictStateTypeList(req, null, (err: grpcWeb.Error, response: DictStateTypeListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);

        let count = 0;
        const result = [];
        data.stateTypeListList.forEach(el => {
            if(count < data.stateTypeListList.length) {
              result.push({
                    ind: el.ind,
                    caption: el.caption,
                    captionregion: el.captionregion,
                    descr: el.descr,
                    isSaved: 1,
                  });
              }
              count ++;
        });
        observer.next(result);
      });
    });
  }

public StatusGroupList(): any {
    const sess = this.authService.getSess();
    const req = new DictStatusGroupListRequest();

    const result = [];
    return new Observable(observer => {
          this.DictionaryClient.dictStatusGroupList(req, null, (err: grpcWeb.Error, response: DictStatusGroupListRes) => {
            if (err) {
              this.authService.errorHandler(err);
              observer.next([]);
              return;
            }
            const data = response.toObject();
            // console.log(data.taskTypeListList);
            observer.next(data.statusGroupListList);
          });
        });
  }

  public MonObjectListAll(): any {
    const sess = this.authService.getSess();
    const req = new DictMonObjectListRequest();

    const result = [];
    return new Observable(observer => {
          this.DictionaryClient.dictMonObjectList(req, null, (err: grpcWeb.Error, response: DictMonObjectListRes) => {
            if (err) {
              this.authService.errorHandler(err);
              observer.next([]);
              return;
            }
            const data = response.toObject();
            // console.log(data.taskTypeListList);
            observer.next(data.monObjectListList);
          });
        });
  }

  public AccountStatusList(){
    const sess = this.authService.getSess();
    const req = new DictAccountStatusListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictAccountStatusList(req, null,
        (err: grpcWeb.Error, response: DictAccountStatusListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.accountStatusListList);
      });
    });
  }

  public DictRegionList(){
    const sess = this.authService.getSess();
    const req = new DictRegionListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictRegionList(req, null,
        (err: grpcWeb.Error, response: DictRegionListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.regionListList);
      });
    });
  }

  public PremesisTypeList(){
    const sess = this.authService.getSess();
    const req = new DictPremesisTypeListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictPremesisTypeList(req, null,
        (err: grpcWeb.Error, response: DictPremesisTypeListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.premesisTypeListList);
      });
    });
  }

  public UnitTypeList(){
    const sess = this.authService.getSess();
    const req = new DictUnitTypeListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictUnitTypeList(req, null,
        (err: grpcWeb.Error, response: DictUnitTypeListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.unitTypeListList);
      });
    });
  }

  public DictMonObjectStateList(){
    const sess = this.authService.getSess();
    const req = new DictMonObjectInfoListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictMonObjectStateList(req, null,
        (err: grpcWeb.Error, response: DictMonObjectStateListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.monObjectStateListList);
      });
    });
  }

  public DictOwnershipTypeList(){
    const sess = this.authService.getSess();
    const req = new DictOwnershipTypeListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictOwnershipTypeList(req, null,
        (err: grpcWeb.Error, response: DictOwnershipTypeListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.ownershipTypeListList);
      });
    });
  }

  public DictMonthInspectionTypeList(){
    const sess = this.authService.getSess();
    const req = new DictMonthInspectionTypeListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictMonthInspectionTypeList(req, null,
        (err: grpcWeb.Error, response: DictMonthInspectionTypeListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.monthInspectionTypeListList);
      });
    });
  }

  public GetDictAdTypeList() : any{
    // console.log('data');
    const sess = this.authService.getSess();
    const req = new DictAdTypeListRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictAdTypeList(req, null,
        (err: grpcWeb.Error, response: DictAdTypeListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.adTypeListList);
      });
    });
  }

  public GetDictAdValueListType() : any{
    // console.log('data');
    const sess = this.authService.getSess();
    const req = new DictAdValueListTypeRequest();


    return new Observable(observer => {
      this.DictionaryClient.dictAdValueListType(req, null,
        (err: grpcWeb.Error, response: DictAdValueListTypeRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.adValueListTypeList);
      });
    });
  }

  // public MonObjectList() {
  //   const sess = this.authService.getSess();
  //   const req = new DictMonObjectInfoListRequest();
  //   req.setConnectionInd(Number(sess.cid));
  //   req.setSessId(sess.sid);

  //   return new Observable(observer => {
  //     if (this.items.length > 0) {
  //       observer.next(this.items);
  //       return;
  //     }
  //     this.DictionaryClient.dictMonObjectList(req, null, (err: grpcWeb.Error, response: DictMonObjectInfoListRes) => {
  //       // console.log(response.toObject(), err);
  //       if (err) {
  //         this.authService.errorHandler(err);
  //         observer.next([]);
  //         return;
  //       }
  //       const data = response.toObject();
  //       // this.items = data.monObjectListList;
  //       // observer.next(data.monObjectListList);
  //       const result = [];
  //       data.monObjectListList.forEach(e => {
  //         result.push({ind: e.monObjectInd, caption: e.caption});
  //       });
  //       observer.next(result);
  //     });
  //   });
  // }
  // public TaskTypeList() {
  //   const sess = this.authService.getSess();
  //   const req = new DictTaskTypeListRequest();
  //   req.setConnectionInd(Number(sess.cid));
  //   req.setSessId(sess.sid);

  //   return new Observable(observer => {
  //     this.DictionaryClient.dictTaskTypeList(req, null, (err: grpcWeb.Error, response: DictTaskTypeListRes) => {
  //       if (err) {
  //         this.authService.errorHandler(err);
  //         observer.next([]);
  //         return;
  //       }
  //       const data = response.toObject();
  //       // console.log(data.taskTypeListList);
  //       observer.next(data.taskTypeListList);
  //     });
  //   });
  // }

  // public StatusList() {
  //   const sess = this.authService.getSess();
  //   const req = new DictStatusListRequest();
  //   req.setConnectionInd(Number(sess.cid));
  //   req.setSessId(sess.sid);

  //   return new Observable(observer => {
  //     if (this.items.length) {
  //       observer.next(this.items);
  //       return;
  //     }
  //     this.DictionaryClient.dictStatusList(req, null, (err: grpcWeb.Error, response: DictStatusListRes) => {

  //       if (err) {
  //         this.authService.errorHandler(err);
  //         observer.next([]);
  //         return;
  //       }

  //       const data = response.toObject();
  //       const result = [];
  //       data.statusListList.forEach(e => {
  //         result[e.ind] = {
  //           ind: e.ind,
  //           colorBackground: DictSystemService.dec2hexString(e.colorBackground),
  //           caption: e.captionStatus,
  //           isGroup: e.isGroup,
  //           taskTypeInd: e.taskTypeInd
  //         };
  //       });

  //       observer.next(result);
  //     });
  //   });
  // }
}
