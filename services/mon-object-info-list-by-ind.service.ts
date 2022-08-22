import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpcWeb from 'grpc-web';
import { Observable } from 'rxjs';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {DictMonObjectInfoByIndRequest, DictMonObjectInfoByIndRes} from "@api/SittelleServiceDictionary_pb";


@Injectable({
  providedIn: 'root'
})
export class MonObjectInfoListByIndService {

  private readonly DictionaryServiceClient: DictionaryClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = Grpc.DictionaryServiceClient;
    }
  }

  public get(id) {
    
    const req = new DictMonObjectInfoByIndRequest();
  
    req.setMonObjectInd(id);

    return new Observable(observer => {
      this.DictionaryServiceClient.dictMonObjectInfoByInd(req, null, (err: grpcWeb.Error, response: DictMonObjectInfoByIndRes) => {

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        console.log(data);
        observer.next(data.monObject);
      });
    });
  }
}
