import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ErrorGrpcService {

  private showed = false;

  constructor(private modalService: NzModalService) { }

  public showError(err) {
    if (this.showed) {
      return;
    }
    this.showed = true;
    this.modalService.error({
      nzMask: false,
      nzClosable: false,
      nzTitle: 'Error gRPC ',
      nzContent: `${err.code}. ${err.message}`,
      nzOnOk: () => { this.showed = false; }
    });
  }
}
