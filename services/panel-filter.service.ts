import { Injectable } from '@angular/core';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';

import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {
    SessPanelFilterMonObjectGetRequest,
    SessPanelFilterMonObjectGetRes,
    SessPanelFilterMonObjectReplaceRequest,
    SessPanelFilterMonObjectReplaceRes,
    SessPanelFilterStatusGetRequest,
    SessPanelFilterStatusGetRes,
    SessPanelFilterStatusReplaceRequest,
    SessPanelFilterStatusReplaceRes,
    SessPanelFilterStateGetRequest,
    SessPanelFilterStateGetRes,
    SessPanelFilterStateReplaceRequest,
    SessPanelFilterStateReplaceRes,
    SessPanelFilterStatusGroupGetRequest,
    SessPanelFilterStatusGroupGetRes,
    SessPanelFilterStatusGroupReplaceRequest,
    SessPanelFilterStatusGroupReplaceRes,
    SessPanelFilterResetRequest,
    SessPanelFilterResetRes,
    PanelListRequest, PanelListRes, DictAppInfoRequest, DictAppInfoRes,
    } from '@api/SittelleServiceDictionary_pb';
import {
  PanelFilterMonObject,
  PanelFilterStatus,
  PanelFilterState,
  PanelFilterStatusGroup,
  } from '@api/SittelleTypeDictionary_pb'
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PanelFilterService {
  private readonly DictionaryServiceClient: DictionaryClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = Grpc.DictionaryServiceClient;
    }
  }
  public FilterMonObjectGet(panelInd: number) {

    const req = new SessPanelFilterMonObjectGetRequest();

    req.setPanelInd(panelInd);

    return new Observable(observer => {
      this.DictionaryServiceClient.sessPanelFilterMonObjectGet(req, null,
        (err: grpcWeb.Error, response: SessPanelFilterMonObjectGetRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        // console.log(data);
        observer.next(data.filter);
      });
    });
  }

  public FilterMonObjectSet(panelInd: number, filter: PanelFilterMonObject) {

    const req = new SessPanelFilterMonObjectReplaceRequest();

    req.setPanelInd(panelInd);
    req.setFilter(filter);

    this.DictionaryServiceClient.sessPanelFilterMonObjectReplace(req, null,
      (err: grpcWeb.Error, response: SessPanelFilterMonObjectReplaceRes) => {

      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
      return;
      }
      const data = response.toObject();
      // console.log( response.toObject());
    });

  }
  public FilterStatusGet(panelInd: number) {

    const req = new SessPanelFilterStatusGetRequest();

    req.setPanelInd(panelInd);
    return new Observable(observer => {
      this.DictionaryServiceClient.sessPanelFilterStatusGet(req, null,
        (err: grpcWeb.Error, response: SessPanelFilterStatusGetRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.filter);
      });
    });
  }
  public FilterStatusSet(panelInd: number, filter: PanelFilterStatus) {

    const req = new SessPanelFilterStatusReplaceRequest();

    req.setPanelInd(panelInd);
    req.setFilter(filter);
    // console.log('data');

    this.DictionaryServiceClient.sessPanelFilterStatusReplace(req, null,
      (err: grpcWeb.Error, response: SessPanelFilterStatusReplaceRes) => {

      if (err) {
        this.authService.errorHandler(err);
        return;
      }
      console.log(err, response);
        // observer.next(data.filter);
    });

  }
  public FilterStateGet(panelInd: number) {

    const req = new SessPanelFilterStateGetRequest();

    req.setPanelInd(panelInd);
    return new Observable(observer => {
      this.DictionaryServiceClient.sessPanelFilterStateGet(req, null,
        (err: grpcWeb.Error, response: SessPanelFilterStateGetRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.filter);
      });
    });
  }
  public FilterStateSet(panelInd: number, filter: PanelFilterState) {

    const req = new SessPanelFilterStateReplaceRequest();

    req.setPanelInd(panelInd);
    req.setFilter(filter);


    this.DictionaryServiceClient.sessPanelFilterStateReplace(req, null,
      (err: grpcWeb.Error, response: SessPanelFilterStateReplaceRes) => {

      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return;
      }

      const data = response.toObject();
      console.log(data);
      // observer.next(data.filter);
    });

  }
  public FilterStatusGroupGet(panelInd: number) {

    const req = new SessPanelFilterStatusGroupGetRequest();

    req.setPanelInd(panelInd);
    return new Observable(observer => {
      this.DictionaryServiceClient.sessPanelFilterStatusGroupGet(req, null,
        (err: grpcWeb.Error, response: SessPanelFilterStatusGroupGetRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        observer.next(data.filter);
      });
    });
  }
  public FilterStatusGroupSet(panelInd: number, filter: PanelFilterStatusGroup) {

    const req = new SessPanelFilterStatusGroupReplaceRequest();

    req.setPanelInd(panelInd);
    req.setFilter(filter);


    this.DictionaryServiceClient.sessPanelFilterStatusGroupReplace(req, null,
      (err: grpcWeb.Error, response: SessPanelFilterStatusGroupReplaceRes) => {

      if (err) {
        this.authService.errorHandler(err);
        return;
      }

      const data = response.toObject();
      // console.log(data);
      // observer.next(data.filter);
    });

  }
  public FilterReset(panelInd: number) {

    const req = new SessPanelFilterResetRequest();

    req.setPanelInd(panelInd);
    return new Observable(observer => {
      this.DictionaryServiceClient.sessPanelFilterReset(req, null,
        (err: grpcWeb.Error, response: SessPanelFilterResetRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
        // console.log(data);
        // observer.next(data.filter);
      });
    });
  }

  GetDictInfo() {

    const req = new DictAppInfoRequest();

    return new Observable(observer => {
      this.DictionaryServiceClient.dictAppInfo(req, null, (err: grpcWeb.Error, response: DictAppInfoRes) => {
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
