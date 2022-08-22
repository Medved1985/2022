import { Injectable } from '@angular/core';
import { AddEquipmentInstallationRequest, AddEquipmentListRequest, Equipment, EquipmentInstallation,
  EquipoAppInfoRequest, EquipoAppInfoRes, GetBuildingRoomListRequest, GetBuildingRoomListResponse,
  GetEquipmentConfListRequest, GetEquipmentConfListResponse, GetEquipmentInstallationListRequest,
  GetEquipmentInstallationListResponse, GetEquipmentListRequest, GetEquipmentListResponse,
  GetEquipmentStateDictListRequest, GetEquipmentStateDictListResponse,
  GetEquipmentStatusDictListRequest, GetEquipmentStatusDictListResponse, ParseByteRequest,
  ParseByteResponse, RemoveEquipmentInstallationRequest, RemoveEquipmentListRequest,
  SetEquipmentInstallationRequest, SetEquipmentListRequest } from '@api/equipo_pb';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import * as grpc_methods from './grpc.methods';
import {EquipoClient} from '@api/EquipoServiceClientPb';
import * as grpcWeb from 'grpc-web';
import { EnumBuildingType } from '@api/SittelleConst_pb';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  private readonly equipoClient: EquipoClient;

  constructor(private Grpc: GrpcService, private authService: AuthService ) {
    if (!this.equipoClient) {
      this.equipoClient = Grpc.EquipoClient;
    }
  }


   getEquipmentStatusDictList(){
    const sess = this.authService.getSess();
    const req = new GetEquipmentStatusDictListRequest();
     

    return new Observable(observer => {
      this.equipoClient.getEquipmentStatusDictList(req, null, (err: grpcWeb.Error, response: GetEquipmentStatusDictListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data)
        observer.next(data.equipmentstatusList);
      });
    });
  }


  getEquipmentStateDictList(){
    const sess = this.authService.getSess();
    const req = new GetEquipmentStateDictListRequest();
     

    return new Observable(observer => {
      this.equipoClient.getEquipmentStateDictList(req, null, (err: grpcWeb.Error, response: GetEquipmentStateDictListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data)
        observer.next(data.equipmentstatelistList);
      });
    });
  }

  getEquipmentList(handleError: boolean = true) {
    const sess = this.authService.getSess();
    const req = new GetEquipmentListRequest();
     

    return new Observable(observer => {
      this.equipoClient.getEquipmentList(req, null, (err: grpcWeb.Error, response: GetEquipmentListResponse) => {
        if (err) {
          if (handleError){
            this.authService.errorHandler(err);
          }
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log("classparamList",data)
        observer.next(data.equipmentlistList);
      });
    });
  }

  equipmentInstallationList() {
    const sess = this.authService.getSess();
    const req = new GetEquipmentInstallationListRequest();
     

    return new Observable(observer => {
      this.equipoClient.getEquipmentInstallationList(req, null, (err: grpcWeb.Error, response: GetEquipmentInstallationListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.equipmentinstallationlistList);
      });
    });
  }

  equipInstallRemove(equipInstall: number){
    const sess = this.authService.getSess();
    const req = new RemoveEquipmentInstallationRequest();
     
    req.setEquipmentinstallationind(equipInstall);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.equipoClient.removeEquipmentInstallation(req, null,
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

  public equipListAdd(equipment){
    const sess = this.authService.getSess();
    const req = new AddEquipmentListRequest();
     
    // console.log(this.grpcContractByMonObjFromObject(equipList));
    req.setEquipment(this.grpcequipListFromObject(equipment));
    return new Observable(observer => {
      this.equipoClient.addEquipmentList(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public equipmentInstallListAdd(equipmentInstallList: EquipmentInstallation.AsObject){
    const sess = this.authService.getSess();
    const req = new AddEquipmentInstallationRequest();
     
    // console.log(this.grpcContractByMonObjFromObject(equipList));
    req.setEquipmentinstallation(this.grpcequipInstallListFromObject(equipmentInstallList));
    return new Observable(observer => {
      this.equipoClient.addEquipmentInstallation(req, null, (err: grpcWeb.Error, response: null) => {
        if (err) {
          // console.log(err);
          this.authService.errorHandler(err);
          observer.next(false);
          return;
        }
        observer.next(true);
      });
    });
  }

  public equipListSet(equipList){
    const sess = this.authService.getSess();
    const req = new SetEquipmentListRequest();
     
    req.setEquipment(this.grpcequipListFromObject(equipList));

    this.equipoClient.setEquipmentList(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return err;
      }
      this.authService.mesHandler('Сохранено');
      return null;
    });
  }

  equipmentListRemove(equipId){
    const sess = this.authService.getSess();
    const req = new RemoveEquipmentListRequest();
     
    req.setEquipmentind(equipId);
    // console.log(this.constructor.name, 'AccountRemove', AccountInd)
    return new Observable(observer => {
      this.equipoClient.removeEquipmentList(req, null,
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

  public equipInstallListSet(equipList){
    const sess = this.authService.getSess();
    const req = new SetEquipmentInstallationRequest();
     
    req.setEquipmentinstallation(this.grpcequipInstallListFromObject(equipList));

    this.equipoClient.setEquipmentInstallation(req, null,
      (err: grpcWeb.Error, response: null) => {
      if (err) {
        console.log(err);
        this.authService.errorHandler(err);
        return err;
      }
      this.authService.mesHandler('Сохранено');
      return null;
    });
  }

  private grpcequipInstallListFromObject(value: EquipmentInstallation.AsObject): EquipmentInstallation{
    const res = new EquipmentInstallation();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setEquipmentlistind(value.equipmentlistind);
    res.setBuildingroomind(value.buildingroomind);
    res.setEquipmentconfind(value.equipmentconfind);
    res.setLogicaladdress(value.logicaladdress);
    res.setModelclassobjectlist(value.modelclassobjectlist);
    res.setDescription(value.description);
    res.setEngineeringsystemind(value.engineeringsystemind);
    return res;
  }

  private grpcequipListFromObject(value: Equipment.AsObject): Equipment{
    const res = new Equipment();
    res.setInd(value.ind);
    res.setCaption(value.caption);
    res.setClasslistind(value.classlistind);
    res.setDateoflastverification(value.dateoflastverification);
    res.setEquipmentStateDictInd(value.equipmentStateDictInd);
    res.setEquipmentStatusDictInd(value.equipmentStatusDictInd);
    res.setFirmwareversion(value.firmwareversion);
    res.setInventorynumber(value.inventorynumber);
    res.setIsvirtual(value.isvirtual);
    res.setModelclassobjectlistind(value.modelclassobjectlistind);
    res.setSerialnumber(value.serialnumber);
    return res;
  }

  GetEquipmentConfList() {
    const sess = this.authService.getSess();
    const req = new GetEquipmentConfListRequest();
     

    return new Observable(observer => {
      this.equipoClient.getEquipmentConfList(req, null, (err: grpcWeb.Error, response: GetEquipmentConfListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.equipmentconfListList);
      });
    });
  }

  GetBuildingRoomList() {
    const sess = this.authService.getSess();
    const req = new GetBuildingRoomListRequest();
     
    req.setBuildingroomind(EnumBuildingType.BUILDING_ALL);

    return new Observable(observer => {
      this.equipoClient.getBuildingRoomList(req, null, (err: grpcWeb.Error, response: GetBuildingRoomListResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.buildingRoomListList);
      });
    });
  }

  GetEquipoInfo() {
    const sess = this.authService.getSess();
    const req = new EquipoAppInfoRequest();

    return new Observable(observer => {
      this.equipoClient.equipoAppInfo(req, null, (err: grpcWeb.Error, response: EquipoAppInfoRes) => {
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

  GetParseByte(bites:Uint8Array) {
    const sess = this.authService.getSess();
    const req = new ParseByteRequest();
    req.setInput(bites);

    return new Observable(observer => {
      this.equipoClient.parseByte(req, null, (err: grpcWeb.Error, response: ParseByteResponse) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.result);
      });
    });
  }

}
