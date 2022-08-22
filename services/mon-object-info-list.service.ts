import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {DictMonObjectInfoListRequest, DictMonObjectInfoListRes} from '@api/SittelleServiceDictionary_pb';
import { TTaskCardInfo, TMonObjectInfo} from '@projectApp/common/common-types'

@Injectable({
  providedIn: 'root'
})
export class MonObjectInfoListService {

  private readonly DictionaryServiceClient: DictionaryClient;


  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = Grpc.DictionaryServiceClient;
    }
  }

  public get() {
    const sess = this.authService.getSess();
    const req = new DictMonObjectInfoListRequest();
     

    return new Observable(observer => {
      this.DictionaryServiceClient.dictMonObjectInfoList(req, null, (err: grpcWeb.Error, response: DictMonObjectInfoListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        console.log(data);
        observer.next(data.monObjectListList);
      });
    });
  }

  public newObjectList() {
    const sess = this.authService.getSess();
    const req = new DictMonObjectInfoListRequest();
     

    return new Observable(observer => {
      this.DictionaryServiceClient.dictMonObjectInfoList(req, null, (err: grpcWeb.Error, response: DictMonObjectInfoListRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        let count = 0;
        const result: Array<TMonObjectInfo> = [];

        data.monObjectListList.forEach(el => {
          if(count < data.monObjectListList.length) {
              result.push({
                    monObjectInd: el.monObjectInd,
                    caption: el.caption,
                    isSystem: el.isSystem,
                    number: el.number,
                    premesisType: el.premesisType,
                    openDate: el.openDate,
                    unitType: el.unitType,
                    salesarea: el.salesarea,
                    totalarea: el.totalarea,
                    region: el.region,
                    company: el.company,
                    phone: el.phone,
                    address: el.address,
                    email: el.email,
                    contract: '',
                    contactor: '',
                    companyList: [],
                    contactList: [],
                  });
              }
              count ++;
        });
        observer.next(result);
      });
    });
  }
}
