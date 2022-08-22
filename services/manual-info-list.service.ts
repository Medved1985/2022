import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {Observable} from 'rxjs';
import {ManualInfoListRequest, ManualInfoListRes} from '@api/SittelleServiceDictionary_pb';

@Injectable({
  providedIn: 'root'
})
export class ManualInfoListService {

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = Grpc.DictionaryServiceClient;
    }
  }

  private readonly DictionaryServiceClient: DictionaryClient;
  private items = null;

  public get() {
    
    const req = new ManualInfoListRequest();
     

    return new Observable(observer => {
      if (this.items) {
        observer.next(this.items);
        return;
      }

      this.DictionaryServiceClient.manualInfoList(req, null, (err: grpcWeb.Error, response: ManualInfoListRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        const result = {};
        data.listList.forEach(e => {
          result[e.ind] = e;
        });
        this.items = result;
        observer.next(result);
      });
    });
  }
}
