import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import * as grpcWeb from 'grpc-web';
import {DictionaryClient} from '@api/SittelleServiceDictionaryServiceClientPb';
import {DictTaskTypeListRequest, DictTaskTypeListRes} from "@api/SittelleServiceDictionary_pb";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskTypeListService {

  private readonly DictionaryServiceClient: DictionaryClient;

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = Grpc.DictionaryServiceClient;
    }
  }

  public get() {
   
    const req = new DictTaskTypeListRequest();
  

    return new Observable(observer => {
      this.DictionaryServiceClient.dictTaskTypeList(req, null, (err: grpcWeb.Error, response: DictTaskTypeListRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        // console.log(data);
        observer.next(data.taskTypeListList);
      });
    });
  }
}
