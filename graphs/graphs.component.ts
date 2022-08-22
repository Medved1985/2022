import {Component, OnInit} from '@angular/core';
import * as shape from 'd3-shape';

import {SystemService} from '@projectApp/services/system/system.service';
import { ChartMonObjectListStateService } from '@projectApp/services/chart-mon-object-list-state.service';
import { DictSystemService } from '@projectApp/services/dict-system.service';
import { DictStatus, MonObjectShort } from '@api/SittelleTypeDictionary_pb';
import { MonObjectListService } from '@projectApp/services/mon-object-list.service';
import { TaskTypeListService } from '@projectApp/services/task-type-list.service';
import { StatusListService } from '@projectApp/services/status-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { multi } from './data';
import { switchAll } from 'rxjs/operators';
import {
  CountDaysWithoutCrashByMonObj, CompletedWorkByCompany,
  TimeRepairsDefectType
} from '@api/SittelleServiceChart_pb';
import { id } from '@swimlane/ngx-charts';
import { TunerPanelService } from '@projectApp/services/tuner-panel.service'
// import { Company, Contract, ContractByMonObj} from '@api/tuner_pb';
import { EnumConfigureRight, EnumSystemConst, EnumSystemTaskStatus } from '@api/SittelleConst_pb';
import { AuthService } from '@projectApp/services/auth.service';
import { Company } from '@api/SittelleTypeOffice_pb';
import { ContractByMonObj } from '@api/tuner_pb';
import { ConnectionRightResult } from '@api/SittelleServiceAuthorization_pb';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.sass']
})
export class GraphsComponent implements OnInit {
  multi: any[] = [];
  single: any[] = [];
  single1: any[] = [];
  isVisibleModalTO = false;
  isVisibleModalCrit = false;
  configureRight1: EnumConfigureRight = EnumConfigureRight.CONFIGURE_RIGHT_READ_ORGANIZATION;
  admRights: number;
  connRights: ConnectionRightResult.AsObject = {
    accountGroupListList: [],
    adminRights: 0,
    configRights: 0,
    sessind: 0,
    taskRights: 0,
  }
  visibleHelp = false;
  environment = environment;
  COMPANY_EMPTY_IND = EnumSystemConst.COMPANY_EMPTY_IND;

  STATUS_MONITORING_FIRE_STATE = EnumSystemTaskStatus.STATUS_MONITORING_FIRE_STATE;
  STATUS_MONITORING_CRITICAL_STATE = EnumSystemTaskStatus.STATUS_MONITORING_CRITICAL_STATE;
  STATUS_MONITORING_DEFECT_STATE = EnumSystemTaskStatus.STATUS_MONITORING_DEFECT_STATE;
  STATUS_MONITORING_COMMUNICATION_ERROR_STATE = EnumSystemTaskStatus.STATUS_MONITORING_COMMUNICATION_ERROR_STATE;
  STATUS_MONITORING_NORMAL_STATE = EnumSystemTaskStatus.STATUS_MONITORING_NORMAL_STATE;

  STATUS_MONTHINSPECTION_AUTO_PLANNING = EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_PLANNING;
  STATUS_MONTHINSPECTION_AUTO_EXECUTE = EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_EXECUTE;
  STATUS_MONTHINSPECTION_CANCEL = EnumSystemTaskStatus.STATUS_MONTHINSPECTION_CANCEL;
  STATUS_MONITORING_ALARM_STATE = EnumSystemTaskStatus.STATUS_MONITORING_ALARM_STATE;
  STATUS_MONTHINSPECTION_AUTO_NOT_COMPLETE = EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_NOT_COMPLETE;

  DaysWithoutCrashData: any[] = [];
  AbandonedChartData: any[] = [];
  RepairsDefectChartData: any[] = [];
  MonthMaintenanceChartData: any[] = [];
  viewState: any[] = [];
  viewDefect: any[] = [];
  view1: any[];
  view10: any[];
  companyList: Array<Company.AsObject>;

  MonthMaintenanceCompanyIndList = new Array();
  RepairsDefectCompanyIndList = new Array();
  MonthMaintenanceObjectIndList = new Array();
  RepairsDefectObjectIndList = new Array();
  // actualMonObjectList = new Array();
  monCategory = new Array(4);
  monObjectList: Array<MonObjectShort.AsObject> = [];
  statusListSearch = [];
  taskTypeList = null;
  statusList = null;
  chartCompanyMonthAverage = null;
  // chartCompanyMonthAverage2 = null;
  chartRepairsDefectAverage1 = null;
  completedWorkByCompanyList = null;
  tasksabandonedfaultswithdateList = new Array();
  countdayswithoutcrashbymonobjList = new Array();
  timerepairsdefecttypeList = new Array();
  statusId: number;
  sortType: string;
  taskind: number;
  applydate: string;
  date = new Date();
  month = this.date.getMonth();
  year = this.date.getFullYear();
  monthNow: string;
  contractList: Array<ContractByMonObj.AsObject> = [];

  countdayswithoutcrash: CountDaysWithoutCrashByMonObj.AsObject;
  i: number;
  test: string;
  link = new Array();

  // options for the chart
  legend = true;
  xAxis = true;
  yAxis = true;
  xAxis1 = true;
  yAxis1 = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showXAxisLabel1 = true;
  xAxisLabel = '';
  xAxisLabel1 = '';
  showYAxisLabel = true;
  showYAxisLabel1 = true;
  yAxisLabel = 'Время, дни';
  yAxisLabelGetPercent = 'Процент выполнения, %';

  yAxisLabel2 = true;
  isStateSpinning = false;
  getAbandonedSpinning = false;
  getTimeAverageRepairSpinning = false;
  getChartCompanyMonthMaintenanceSpinning = false;
  timeline = true;
  showLabels = true;
  animations = true;
  legendTitle = 'Подрядчики';
  legendTitle1 = 'Объекты';

  repairsCompanyMonObjectList: MonObjectShort.AsObject[] = [];
  repairsCompanyMonObjectIndSelected: number[] = [];
  maintenanceCompanyMonObjectList: MonObjectShort.AsObject[] = [];
  maintenanceCompanyMonObjectIndSelected: number[] = [];

  colorScheme = {
    domain: ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A']
  };
  colorScheme2 = {
    // domain: ['#ff5959', '#87CEFA', '#98FB98', '#00FA9A']
    domain: ['#ff5959', '#ff5959']
  };
  colorScheme1 = {
    domain: ['#a2b600', '#66ff99', '#6799ff']
  };

  shape: shape;
  multi2: any;
  // multi2Color: any = {
  //   domain: ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A']
  // };
  multi2Color: any = {
    domain: []
  };
  horizontalBar: any;
  horizontalBarColor: any = {
    domain: ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A']
  };
  ind: any;

  constructor(private chartMonObjectListStateService: ChartMonObjectListStateService, private statusListService: StatusListService,
              private router: Router, private tunerPanelService: TunerPanelService,
              private taskTypeListService: TaskTypeListService, private authService: AuthService, private dictSystemService: DictSystemService,
              public systemService: SystemService) {

    this.monthNow = this.MonthCaptionByNumber(this.month);

    this.authService.connectionRight().subscribe(data => {
      this.connRights = data as ConnectionRightResult.AsObject;
      //  @ts-ignore
      if (this.connRights.adminRights & (1 << this.configureRight1)) {
        this.admRights = 1;
      }
    })

    // fix graph height
    let w = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    w = w / 2.7

    let w1 = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    w1 = w1 / 1.2

    this.view1 = [w, 250];
    this.view10 = [w1, 600];

    this.tunerPanelService.OrganizationList(false).subscribe(data => {
      // console.log(data);
      this.companyList = data as Company.AsObject[];
      this.companyList = this.companyList.filter(item => item.ind !== this.COMPANY_EMPTY_IND);
      this.RepairsDefectCompanyIndList = [];
      console.log(this.companyList)
      this.MonthMaintenanceCompanyIndList = [];
      for (let i = this.companyList.length - 1; i >= 0; i--) {
        if ((!this.companyList[i].active.value) || (this.companyList[i].removedata.value > 0)) {
          this.companyList.splice(i, 1);
        } else {
          this.RepairsDefectCompanyIndList.push(this.companyList[i].ind);
          this.MonthMaintenanceCompanyIndList.push(this.companyList[i].ind);
        }
      }
      // get contact list
      tunerPanelService.ContractList(false).subscribe(getContractList => {
        this.contractList = getContractList as Array<ContractByMonObj.AsObject>
        this.SelectMonthRepairsCompany(null);
        this.SelectMonthMaintenanceCompany(null);

        this.ChartRepairsDefectUpdate();
        this.ChartCompanyMonthMaintenanceUpdate();
      });
      // console.log("лист",this.RepairsDefectCompanyIndList)
    });

    statusListService.get().subscribe(data => {
      // console.log(data);
      this.statusList = data;
    });

    this.monObjectList = this.systemService.monObjectList.filter(
      actualMonList => actualMonList.active && actualMonList.monObjectInd !== EnumSystemConst.MONOBJECT_ALL_IND);

    if (this.monObjectList.length < 20) {
      this.viewState = [w1, 600];
      this.viewDefect = [w1, 600];
    }

    if (this.monObjectList.length > 20 && this.monObjectList.length < 50) {
      this.viewState = [w1, 1200];
      this.viewDefect = [w1, 1200];
    }

    if (this.monObjectList.length > 50 && this.monObjectList.length < 100) {
      this.viewState = [w1, 2000];
      this.viewDefect = [w1, 2000];
    }

    if (this.monObjectList.length > 100 && this.monObjectList.length < 250) {
      this.viewState = [w1, 3200];
      this.viewDefect = [w1, 4200];
    }

    if (this.monObjectList.length > 250) {
      this.viewState = [w1, 4200];
      this.viewDefect = [w1, 5500];
    }


    this.taskTypeListService.get().subscribe(data => {
      this.taskTypeList = data;
      // console.log(data);
    });


    this.chartMonObjectListStateService.aggregateMonitoringMonObject().subscribe(data =>
      // @ts-ignore
      this.monCategory = data.monCategory as []);

    this.chartMonObjectListStateService.getAbandoned().subscribe(data =>
      //  console.log(data)

      this.tasksabandonedfaultswithdateList = data as []);

    this.chartMonObjectListStateService.getDaysWithoutCrash().subscribe(data =>
      //  console.log(data)
      this.countdayswithoutcrashbymonobjList = data as []
    );


  }

  closeHelp(): void {
    this.visibleHelp = false;
  }

  openHelp(): void {
    this.visibleHelp = true;
  }

  defectCompanyChange(event, RepairsDefectCompanyIndList) {
    if (RepairsDefectCompanyIndList.length === 1) {

    } else {
      // this.repairsDefectMonObjectList = [];
    }
  }

  onSelect(event) {
    console.log(event);
    const url = event.name;
    window.open(url, '_blank');
  }

  // onActivate(event) {
  //   console.log(event.entries[0].series);
  // }

  showModalTO(): void {
    this.isVisibleModalTO = true;
  }

  showModalCrit(): void {
    this.isVisibleModalCrit = true;
  }

  handleOkTO(): void {
    // console.log('Button ok clicked!');
    this.isVisibleModalTO = false;
  }

  handleCancelTO(): void {
    // console.log('Button cancel clicked!');
    this.isVisibleModalTO = false;
  }

  handleOkCrit(): void {
    // console.log('Button ok clicked!');
    this.isVisibleModalCrit = false;
  }

  handleCancelCrit(): void {
    // console.log('Button cancel clicked!');
    this.isVisibleModalCrit = false;
  }

  ngOnInit() {
    this.isStateSpinning = true;
    this.dictSystemService.StatusListAsObject().subscribe(statusList => {
      this.statusList = statusList as Array<DictStatus.AsObject>;
      this.getGraphData();
    });
  }

  getGraphData() {
    this.chartMonObjectListStateService.get([this.STATUS_MONITORING_FIRE_STATE, this.STATUS_MONITORING_CRITICAL_STATE,
    this.STATUS_MONITORING_DEFECT_STATE, this.STATUS_MONITORING_COMMUNICATION_ERROR_STATE,
    this.STATUS_MONITORING_ALARM_STATE], this.statusList).subscribe(data => {
      // console.log(data);
      //  @ts-ignore
      this.multi2 = data.series;
      // @ts-ignore
      this.multi2Color = { domain: data.color };
      // this.isStateSpinning = false;
    });

    this.chartMonObjectListStateService.get([this.STATUS_MONITORING_FIRE_STATE,
    this.STATUS_MONITORING_CRITICAL_STATE, this.STATUS_MONITORING_DEFECT_STATE,
    this.STATUS_MONITORING_COMMUNICATION_ERROR_STATE, this.STATUS_MONITORING_NORMAL_STATE,
    this.STATUS_MONITORING_ALARM_STATE], this.statusList).subscribe(data => {
      // console.log(data);
      // @ts-ignore
      this.horizontalBar = data.series;
      // @ts-ignore
      this.horizontalBarColor = { domain: data.color };
    });
    this.chartMonObjectListStateService.aggregateMonitoringMonObject().subscribe(data => {
      // console.log(data);
      // @ts-ignore
      this.single = data.pie;
      // @ts-ignore

      // @ts-ignore
      //  this.colorScheme1 = {domain: data.color};
    });

    this.chartMonObjectListStateService.aggregateMonObjectMonthInspection(this.monObjectList).subscribe(data => {
      // console.log(data);
      // @ts-ignore
      this.single11 = data;
      // @ts-ignore
      this.colorScheme2 = { domain: data.color };
      // this.isStateSpinning = false;
    });

    this.chartMonObjectListStateService.getDaysWithoutCrash().subscribe(data => {
      //  console.log(data);

      // @ts-ignore
      this.DaysWithoutCrashData = data;

      // @ts-ignore
      this.colorScheme1 = { domain: data.color };
      this.isStateSpinning = false;
    });

    this.getAbandonedSpinning = true;
    this.chartMonObjectListStateService.getAbandoned().subscribe(data => {
      // console.log(data);
      // @ts-ignore
      this.AbandonedChartData = data;
      // @ts-ignore
      this.colorScheme2 = { domain: data.color };
      this.getAbandonedSpinning = false;
      // this.isStateSpinning = false;
    });

  }

  public ChartRepairsDefectUpdate() {
    this.getTimeAverageRepairSpinning = true;
    const chartRepairsDefectAverage = [];
    const chartCompanyMonObject = [];
    // console.log('start ChartRepairsDefectUpdate')
    if (this.RepairsDefectCompanyIndList.length === 1) {
      // console.log(this.repairsCompanyMonObjectIndSelected)
      this.repairsCompanyMonObjectIndSelected.forEach(monObjectInSelect => {
        const MonObjectRecord = {
          ind: monObjectInSelect,
          name: '',
          series: []
        };
        for (let i = 0; i < this.monObjectList.length; i++) {
          if (this.monObjectList[i].monObjectInd === monObjectInSelect) {
            MonObjectRecord.name = this.monObjectList[i].caption
            break
          }
        }
        for (let i = 1; i <= 12; i++) {
          MonObjectRecord.series.push({
            ind: i,
            year: (this.month + i > 12) ? this.year : this.year - 1,
            month: (this.month + i) % 12 + 1,
            name: this.MonthCaptionByNumber((this.month + i + 1) % 12),
            value: 0,
          })
        }
        chartCompanyMonObject.push(MonObjectRecord);
        // console.log(chartCompanyMonObject);
        // this.isStateSpinning = false;
      });

    } else {
      this.RepairsDefectCompanyIndList.forEach(companyInSelect => {
        this.companyList.forEach(companyItem => {
          if (companyInSelect === companyItem.ind) {
            const companyRecord = {
              name: companyItem.caption,
              ind: companyItem.ind,
              series: []
            };
            for (let i = 1; i <= 12; i++) {
              companyRecord.series.push({
                ind: i,
                year: (this.month + i > 12) ? this.year : this.year - 1,
                month: (this.month + i) % 12 + 1,
                name: this.MonthCaptionByNumber((this.month + i + 1) % 12),
                value: 0,
                tooltipText: '0 минут'
              })
            }
            // console.log(companyRecord)
            chartRepairsDefectAverage.push(companyRecord);
            // this.isStateSpinning = false;
          }
        });
      });
    }
    // get  chart data
    this.chartMonObjectListStateService.TimeRepairsDefect([]).subscribe(data => {
      // console.log(data);
      let timeRepairsDefectTypeList: Array<TimeRepairsDefectType.AsObject>;
      timeRepairsDefectTypeList = data as Array<TimeRepairsDefectType.AsObject>;
      if (this.RepairsDefectCompanyIndList.length === 1) {
        timeRepairsDefectTypeList.forEach(monthData => {
          monthData.defecttasksbycompanyList.forEach(companyData => {
            if (companyData.companyind === this.RepairsDefectCompanyIndList[0]) {
              companyData.defecttasksbymonobjListList.forEach(monObjectChart => {
                chartCompanyMonObject.forEach(monObjectSelected => {
                  if (monObjectChart.listMonobjectInd === monObjectSelected.ind) {

                    for (let i = 0; i < monObjectSelected.series.length; i++) {
                      if (monObjectSelected.series[i].month === monthData.month &&
                        monObjectSelected.series[i].year === monthData.year) {
                        monObjectSelected.series[i].value = monObjectChart.avgDuration / 24 / 60;
                        if (monObjectChart.avgDuration >= 1440) {
                          monObjectSelected.series[i].tooltipText = Math.round(monObjectSelected.series[i].value) + ' дней'
                        } else if (monObjectChart.avgDuration >= 60) {
                          monObjectSelected.series[i].tooltipText = Math.round(monObjectChart.avgDuration / 60) + ' часов'
                        } else {
                          monObjectSelected.series[i].tooltipText = monObjectChart.avgDuration + ' минут'
                        }
                        break
                      }
                    }
                    // if (monthData.month < monObjectSelected.series.length) {
                    //   monObjectSelected.series[monthData.month - 1].value = monObjectChart.avgDuration / 24 / 60;
                    // }
                  }
                });
              });
            }
          });
        });
      } else {
        timeRepairsDefectTypeList.forEach(monthData => {
          monthData.defecttasksbycompanyList.forEach(companyData => {
            for (let j = 0; j < chartRepairsDefectAverage.length; j++) {
              if (companyData.companyind === chartRepairsDefectAverage[j].ind) {
                let sum = 0;
                let count = 0;
                companyData.defecttasksbymonobjListList.forEach(monObjectData => {
                  sum = sum + monObjectData.avgDuration;
                  count++;
                });
                // add data to chart
                if (count !== 0) {
                  for (let i = 0; i < chartRepairsDefectAverage[j].series.length; i++) {
                    if (chartRepairsDefectAverage[j].series[i].month === monthData.month &&
                      chartRepairsDefectAverage[j].series[i].year === monthData.year
                    ) {
                      chartRepairsDefectAverage[j].series[i].value = sum / count / 24 / 60;
                      if ((sum / count) > 1440) {
                        chartRepairsDefectAverage[j].series[i].tooltipText =
                          Math.round(chartRepairsDefectAverage[j].series[i].value) + ' дней'
                      } else if (sum / count >= 60) {
                        chartRepairsDefectAverage[j].series[i].tooltipText = Math.round(sum / count / 60) + ' часов'
                      } else {
                        chartRepairsDefectAverage[j].series[i].tooltipText = Math.round(sum / count) + ' минут'
                      }
                      break;
                    }
                  }
                }
                break;
              }
            }
          });
        });
      }

      if (this.RepairsDefectCompanyIndList.length === 1) {
        // console.log('else 3', chartCompanyMonObject)
        this.RepairsDefectChartData = chartCompanyMonObject;
        this.getTimeAverageRepairSpinning = false;
        // this.ChartRepairsDefectUpdate();
      } else {
        this.RepairsDefectChartData = chartRepairsDefectAverage;
        this.getTimeAverageRepairSpinning = false;
      }
    });
  }
  public ChartCompanyMonthMaintenanceUpdate() {
    this.getChartCompanyMonthMaintenanceSpinning = true
    const chartCompanyMonthAverage = [];
    const chartCompanyMonObject = [];
    if (this.MonthMaintenanceCompanyIndList.length === 1) {
      this.maintenanceCompanyMonObjectIndSelected.forEach(monObjectInSelect => {
        const MonObjectRecord = {
          ind: monObjectInSelect,
          name: '',
          series: []
        };
        for (let i = 0; i < this.monObjectList.length; i++) {
          if (this.monObjectList[i].monObjectInd === monObjectInSelect) {
            MonObjectRecord.name = this.monObjectList[i].caption
            break
          }
        }
        for (let i = 1; i <= 12; i++) {
          MonObjectRecord.series.push({
            ind: i,
            year: (this.month + i > 12) ? this.year : this.year - 1,
            month: (this.month + i) % 12 + 1,
            name: this.MonthCaptionByNumber((this.month + i + 1) % 12),
            value: 0,
          })
        }
        chartCompanyMonObject.push(MonObjectRecord);
      });
    } else {
      this.MonthMaintenanceCompanyIndList.forEach(companyInSelect => {
        this.companyList.forEach(companyItem => {
          if (companyInSelect === companyItem.ind) {
            const companyRecord = {
              name: companyItem.caption,
              ind: companyItem.ind,
              series: []
            };
            for (let i = 1; i <= 12; i++) {
              companyRecord.series.push({
                ind: i,
                year: (this.month + i > 12) ? this.year : this.year - 1,
                month: (this.month + i) % 12 + 1,
                name: this.MonthCaptionByNumber((this.month + i + 1) % 12),
                value: 0,
              })
            }
            chartCompanyMonthAverage.push(companyRecord);
          }
        });
      });
    }

    this.chartMonObjectListStateService.CompletedWorkByCompany().subscribe(data => {
      let completedWorkByCompanyList: Array<CompletedWorkByCompany.AsObject>;
      completedWorkByCompanyList = data as Array<CompletedWorkByCompany.AsObject>;
      this.completedWorkByCompanyList = completedWorkByCompanyList;
      // console.log('CompletedWorkByCompany', data);
      if (this.MonthMaintenanceCompanyIndList.length === 1) {
        completedWorkByCompanyList.forEach(monthData => {
          monthData.completedworkbycompanybymonthList.forEach(companyData => {
            if (companyData.companyind === this.MonthMaintenanceCompanyIndList[0]) {
              companyData.completedworkbycompanybymonobjListList.forEach(monObjectChart => {
                chartCompanyMonObject.forEach(monObjectSelected => {
                  if (monObjectChart.listMonobjectInd === monObjectSelected.ind) {
                    for (let i = 0; i < monObjectSelected.series.length; i++) {
                      if (monObjectSelected.series[i].month === monthData.month &&
                        monObjectSelected.series[i].year === monthData.year) {
                          monObjectSelected.series[i].value = monObjectChart.percentofwork;
                          break
                      }
                    }
                  }
                });
              });
            }
          });
        });
      } else {
        completedWorkByCompanyList.forEach(monthData => {
          monthData.completedworkbycompanybymonthList.forEach(companyData => {
            for (let j = 0; j < chartCompanyMonthAverage.length; j++) {
              if (companyData.companyind === chartCompanyMonthAverage[j].ind) {
                let sum = 0;
                let count = 0;
                companyData.completedworkbycompanybymonobjListList.forEach(monObjectData => {
                  sum = sum + monObjectData.percentofwork;
                  count++;
                });
                // add data to chart
                if (count !== 0) {
                  for (let i = 0; i < chartCompanyMonthAverage[j].series.length; i++) {
                    if ((chartCompanyMonthAverage[j].series[i].month === monthData.month) &&
                    (chartCompanyMonthAverage[j].series[i].year === monthData.year)) {
                      chartCompanyMonthAverage[j].series[i].value = Math.round(sum / count);
                      break;
                    }
                  }
                }
                break;
              }
            }
          });
        });
      }
      if (this.MonthMaintenanceCompanyIndList.length === 1) {
        // console.log('else 3', chartCompanyMonObject)
        this.MonthMaintenanceChartData = chartCompanyMonObject;
      } else {
        this.MonthMaintenanceChartData = chartCompanyMonthAverage;
      }
      this.getChartCompanyMonthMaintenanceSpinning = false;
    });

  }

  SelectMonthMaintenanceCompany(event) {
    this.maintenanceCompanyMonObjectList = [];
    this.maintenanceCompanyMonObjectIndSelected = [];
    // console.log('SelectMonthMaintenanceCompany')
    if (this.MonthMaintenanceCompanyIndList.length === 1) {
      // console.log(this.contractList)
      // console.log(this.MonthMaintenanceCompanyIndList)
      this.contractList.forEach(element => {
        if (element.contract.listCompanyInd === this.MonthMaintenanceCompanyIndList[0]) {
          element.listMonobjectSystemList.forEach(monObjectItem => {
            const addItem = {
              monObjectInd: monObjectItem.monobjectInd,
              caption: '',
              isSystem: true,
              active: true,
              removeDate: 0
            }
            this.monObjectList.forEach(dictMonObject => {
              if (dictMonObject.monObjectInd === addItem.monObjectInd) {
                addItem.caption = dictMonObject.caption
                this.maintenanceCompanyMonObjectList.push(addItem)
                this.maintenanceCompanyMonObjectIndSelected.push(addItem.monObjectInd)
              }
            });
          });
        }
      });
      // console.log(this.maintenanceCompanyMonObjectList)
      // console.log(this.maintenanceCompanyMonObjectIndSelected)
    }
  }

  SelectMonthRepairsCompany(event) {
    this.repairsCompanyMonObjectIndSelected = [];
    this.repairsCompanyMonObjectList = [];
    console.log(this.RepairsDefectCompanyIndList)
    console.log(this.contractList)
    if (this.RepairsDefectCompanyIndList.length === 1) {
      this.contractList.forEach(element => {
        if (element.contract.listCompanyInd === this.RepairsDefectCompanyIndList[0]) {
          element.listMonobjectSystemList.forEach(monObjectItem => {
            const addItem = {
              monObjectInd: monObjectItem.monobjectInd,
              caption: '',
              isSystem: true,
              active: true,
              removeDate: 0
            }
            this.monObjectList.forEach(dictMonObject => {
              if (dictMonObject.monObjectInd === addItem.monObjectInd) {
                addItem.caption = dictMonObject.caption
                this.repairsCompanyMonObjectList.push(addItem)
                this.repairsCompanyMonObjectIndSelected.push(addItem.monObjectInd)
              }
            });
          });
        }
      });
      console.log(this.repairsCompanyMonObjectList)
      // console.log(this.repairsCompanyMonObjectIndSelected)
    }
  }

  private MonthCaptionByNumber(monthNumber): string {
    return new Date(2013, monthNumber - 1).toLocaleString('ru', {
      month: 'long'
    });
  }
}
