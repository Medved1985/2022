import {Injectable} from '@angular/core';
import { GetNotificationsRes } from '@projectApp/api/serviceClient_pb';
import {BehaviorSubject} from '../../../node_modules/rxjs';
import {Observable} from '../../../node_modules/rxjs';
// import {TaskChangeNotificationClient} from '@api/SittelleTypeNotification_pb'

@Injectable()
export class NotificationStorageService {

  // Observable navItem source
  private _navItemSource = new BehaviorSubject<GetNotificationsRes.AsObject>(null);
  // Observable navItem stream
  navItem$ = this._navItemSource.asObservable();
  // service command
  changeNav(item: GetNotificationsRes.AsObject) {
    // console.log(item)
    this._navItemSource.next(item);
  }
}

// export class NotificationStorageService {

//   // Observable navItem source
//   private _navItemSource = new BehaviorSubject<TaskChangeNotificationClient.AsObject[]>([]);
//   // Observable navItem stream
//   navItem$ = this._navItemSource.asObservable();
//   // service command
//   changeNav(list: TaskChangeNotificationClient.AsObject[]) {
//     // console.log('NotificationStorageService new item')
//     this._navItemSource.next(list);
//   }
// }


/*@Injectable()

export class NotificationStorageService {
    // storage
    notificationData: Array<any>;
    // publisher
    dataChange:  BehaviorSubject<any>;

    public notificationList: Observable<TaskChangeNotification.AsObject[]>;


    constructor() {
        // crate publisher
        this.dataChange  = new BehaviorSubject(null);
    }

    notificationAdd(list: TaskChangeNotification.AsObject[]){
      this.notificationList = list;
    }
}*/
