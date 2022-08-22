import {Injectable} from '@angular/core';
import {BehaviorSubject} from '../../../node_modules/rxjs';
import {ConfigChangeNotificationClient} from '@api/typeNotification_pb'

@Injectable()
export class NotificationConfigStorageService {

  // Observable navItem source
  private _navItemSource = new BehaviorSubject<ConfigChangeNotificationClient.AsObject[]>([]);
  // Observable navItem stream
  navItem$ = this._navItemSource.asObservable();
  // service command
  changeNav(list: ConfigChangeNotificationClient.AsObject[]) {
    // console.log('NotificationStorageService new item')
    this._navItemSource.next(list);
  }
}
