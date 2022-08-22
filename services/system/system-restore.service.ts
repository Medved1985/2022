import { Injectable } from '@angular/core';
import { EnumMaintenanceType, EnumMaintenancePeriod } from '@api/SittelleConst_pb';

@Injectable({
  providedIn: 'root'
})
export class SystemRestoreService {

  private _dashboardDate: Date = new Date();
  private _maintenanceType = EnumMaintenanceType.MONTHLY;
  private _maintenanceYear = this._dashboardDate.getFullYear();
  private _maintenancePeriod = this._dashboardDate.getMonth() + 1;

  constructor() {

    const value: number = this.get('_dashboardDate')
    if (!value){
      this._dashboardDate = new Date();
    } else {
      this._dashboardDate = new Date(value);
    }
    this._maintenanceType = this.get('_maintenanceType')
    if (!this._maintenanceType){
      this._maintenanceType = EnumMaintenanceType.MONTHLY;
    }
    this._maintenanceYear = this.get('_maintenanceYear')
    if (!this._maintenanceYear){
      this._maintenanceYear = this._dashboardDate.getFullYear();
    }
    this._maintenancePeriod = this.get('_maintenancePeriod')
    if (!this._maintenancePeriod){
      this._maintenancePeriod = this._dashboardDate.getMonth() + 1;;
    }
  }
  public get dashboardDate(): Date {
    return this._dashboardDate;
  }

  public set dashboardDate(value: Date) {
    this._dashboardDate = value;
    this.set('_dashboardDate', value.getTime())
  }

  public get maintenanceType(): number {
    return this._maintenanceType;
  }

  public set maintenanceType(value: number) {
    this._maintenanceType = value;
    this.set('_maintenanceType', value)
    switch (value) {
      case EnumMaintenanceType.MONTHLY:
        this.maintenancePeriod = this.dashboardDate.getMonth() + 1
        break;
      case EnumMaintenanceType.QUARTER:
        this.maintenancePeriod = EnumMaintenancePeriod.MAINTENANCE_PERIOD_FIRST_QUARTER        
        break;
      case EnumMaintenanceType.HALF_YEAR:
        this.maintenancePeriod = EnumMaintenancePeriod.MAINTENANCE_PERIOD_FIRST_HALF_YEAR       
        break;
      case EnumMaintenanceType.YEAR:
        this.maintenancePeriod = EnumMaintenancePeriod.MAINTENANCE_PERIOD_YEAR
        break;
      default:
        break;
    }
  }
  public get maintenanceYear(): number {
    return this._maintenanceYear;
  }

  public set maintenanceYear(value: number) {
    this._maintenanceYear = value;
    this.set('_maintenanceYear', value)
  }
  public get maintenancePeriod(): number {
    return this._maintenancePeriod;
  }

  public set maintenancePeriod(value: number) {
    this._maintenancePeriod = value;
    this.set('_maintenancePeriod', value)
  }

  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }
}


