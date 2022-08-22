import { Injectable } from '@angular/core';
import {GrpcService} from './grpc.service';
import {AuthService} from './auth.service';
import { ExternalPanelListRequest, ExternalPanelListRes } from '@api/SittelleServiceClient_pb';
import {AccountGroupPanel} from '@api/SittelleTypeDictionary_pb'
import * as grpcWeb from 'grpc-web';
import {ClientServiceClient} from '@api/SittelleServiceClientServiceClientPb';
import {BehaviorSubject, Observable} from 'rxjs';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class PanelListService {
  private readonly ClientServiceClient: ClientServiceClient;
  public items = new BehaviorSubject([]);

  constructor(private Grpc: GrpcService, private authService: AuthService) {
    if (!this.ClientServiceClient) {
      this.ClientServiceClient = Grpc.ClientServiceClient;
    }
  }

  panelUrlByInd(panelInd: number, panelId: string): string{
    switch (panelInd) {
      case -12:
        return 'reports'
      case -13:
        return 'graphs'
      case -14:
        return 'objects'
      default:
        return panelId.toLowerCase()
    }
  }
  panelForTask(panelInd: number): boolean{
    if (panelInd !== -12 && panelInd !== -13 && panelInd !== -14){
      return true
    } else {
      return false
    }
  }

  panelById() {
    const req = new ExternalPanelListRequest();
    const sess = this.authService.getSess();


    return new Observable(observer => {
      this.ClientServiceClient.externalPanelList(req, null, (err: grpcWeb.Error, response: ExternalPanelListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        const result: any = [];
        this.items.next(data.panelListList);

        data.panelListList.map(e => {
          result.push({
            caption: e.caption,
            typeList: e.taskTypeListList,
            panel: this.panelForTask(e.ind),
            url: this.panelUrlByInd(e.ind, e.id),
            icon: e.imagePassiveFileName,
            iconActive: e.imageActiveFileName,
            disabled: false
          });
          console.log(result);
        });


        observer.next(result);
      });
    });
  }

  panelByInd(ind: number) {
    const req = new ExternalPanelListRequest();
    const sess = this.authService.getSess();


    return new Observable(observer => {
      this.ClientServiceClient.externalPanelList(req, null, (err: grpcWeb.Error, response: ExternalPanelListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        let res: AccountGroupPanel.AsObject
        for (let i=0; i< data.panelListList.length; i++){
          if (data.panelListList[i].ind === ind){
            res = data.panelListList[i];
            break
          }
        }
        observer.next(res);
      });
    });
  }

  panelList(){
    const req = new ExternalPanelListRequest();
    const sess = this.authService.getSess();


    return new Observable(observer => {
      this.ClientServiceClient.externalPanelList(req, null, (err: grpcWeb.Error, response: ExternalPanelListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.panelListList);
      });
    });
  }
  panelByID(id: string){
    const req = new ExternalPanelListRequest();
    const sess = this.authService.getSess();


    return new Observable(observer => {
      this.ClientServiceClient.externalPanelList(req, null, (err: grpcWeb.Error, response: ExternalPanelListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        let res: AccountGroupPanel.AsObject
        for (let i=0; i< data.panelListList.length; i++){
          if (data.panelListList[i].id.toLowerCase() === id){
            res = data.panelListList[i];
            break
          }
        }
        observer.next(res);
      });
    });
  }

  get() {
    const req = new ExternalPanelListRequest();
    const sess = this.authService.getSess();
    return new Observable(observer => {
      this.ClientServiceClient.externalPanelList(req, null, (err: grpcWeb.Error, response: ExternalPanelListRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        const result: any = [];
        this.items.next(data.panelListList);

        // console.log(data.panelListList);
        data.panelListList.map(e => {
          result.push({
            ind: e.ind,
            caption: e.caption,
            typeList: e.taskTypeListList,
            panel: this.panelForTask(e.ind),
            url: this.panelUrlByInd(e.ind, e.id),
            icon: e.imagePassiveFileName,
            iconActive: e.imageActiveFileName,
            position: 0,
            disabled: false
          });
          // console.log(result);
        });
        // result.sort((a, b) => a.ind < b.ind);
        observer.next(result);
      });
    });
  }
}
