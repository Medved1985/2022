import { Injectable } from '@angular/core';
import { GrpcService } from './grpc.service';
import { AuthService } from './auth.service';
import * as grpcWeb from 'grpc-web';
import { ChartServiceClient } from '@api/SittelleServiceChartServiceClientPb';
import {ChartMonObjectListStateRequest, ChartMonObjectListStateRes,
  GetChartCountTasksListByStatusRequest, GetChartCountTasksListByStatusRes,
  CountTasksByStatus, GetAbandonedFaultsRequest, GetAbandonedFaultsRes,
   GetCountDaysWithoutCrashByMonObjRequest, GetCountDaysWithoutCrashByMonObjRes,
   GetTimeRepairsDefectRes, GetTimeRepairsDefectRequest, CountDaysWithoutCrashByMonObj,
   GetCompletedWorkByCompanyRequest, GetCompletedWorkByCompanyRes,
   ChartAppInfoRequest, ChartAppInfoRes, MonthInspectionTaskListRequest, MonthInspectionTaskListRes} from '@api/SittelleServiceChart_pb';
import { Observable, BehaviorSubject } from 'rxjs';
import { StatusListService } from './status-list.service';
import {DictStatus} from '@api/SittelleTypeDictionary_pb'
import { EnumSystemTaskStatus, EnumTaskType, EnumSystemConst } from '@api/SittelleConst_pb';
import {ChartSeriesValue} from '@api/SittelleTypeDictionary_pb';
import {MonObjectGroupByMonthlyInspectionRequest} from '@api/SittelleServiceChart_pb';
import {MonObjectGroupByMonthlyInspectionRes} from '@api/SittelleServiceChart_pb';
import {CountTasksByMonObject} from '@api/SittelleServiceChart_pb';
import {DictSystemService} from './dict-system.service';
import {
  GetOrganizationListRequest,
  GetOrganizationListResponse,
  GetContractListRequest,
  GetContractListResponse,
  GetEngineeringSystemTypeListRequest,
  GetEngineeringSystemTypeListResponse,
  } from '@api/tuner_pb';


@Injectable({
  providedIn: 'root'
})
export class ChartMonObjectListStateService {
  // monObjectList = null;
  private readonly ChartServiceClient: ChartServiceClient;
  // statusList = null;

  constructor(private Grpc: GrpcService, private authService: AuthService,
     private statusListService: StatusListService) {
    if (!this.ChartServiceClient) {
      this.ChartServiceClient = Grpc.ChartServiceClient;
    }
    // this.monObjectList = this.DictSystemService.MonObjectList()

  }
  private static dec2hexString(dec) {
    return '#' + dec.toString(16).padStart(6, '0').toLowerCase();
  }

public aggregateMonObjectMonthInspection(monObjectList) {

  const req = new MonObjectGroupByMonthlyInspectionRequest();
  const now = new Date();

  req.setYyyy(now.getFullYear().toString());
  req.setMm((now.getMonth()+1).toString());

  return new Observable(observer => {
    this.ChartServiceClient.monObjectGroupByMonthlyInspection(req, null, (err: grpcWeb.Error,
      response: MonObjectGroupByMonthlyInspectionRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        const pieRes:  Array<any> = [];
        pieRes.push({
          name: 'Не приступали',
          value: 0
        });
        pieRes.push({
          name: 'В процессе',
          value: 0
        });
        pieRes.push({
          name: 'Проведен',
          value: 0
        });

        // aggregate  object
        const chart = data.chartcounttaskslistbymobobjectList as CountTasksByMonObject.AsObject[];

          for (let i = 0; i < chart.length; i ++){
            let anyPlanned = false;
            let anyInProcess = false;
            let anyCanceled = false;
            let anyPerformed = false;

              for (let j = 0; j < chart[i].chartcounttaskslistbystatusList.length ; j ++ ) {
                if (chart[i].chartcounttaskslistbystatusList[j].listStatusInd ===
                  EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_EXECUTE) { // проведено
                  anyPerformed = chart[i].chartcounttaskslistbystatusList[j].counttasksbystatus > 0
                }
                if (chart[i].chartcounttaskslistbystatusList[j].listStatusInd ===
                  EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_PLANNING) { // Запланировано
                  anyPlanned = chart[i].chartcounttaskslistbystatusList[j].counttasksbystatus > 0
                }
                if (chart[i].chartcounttaskslistbystatusList[j].listStatusInd ===
                  EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_NOT_COMPLETE) { // В процессе
                  anyInProcess = chart[i].chartcounttaskslistbystatusList[j].counttasksbystatus > 0
                }
                if (chart[i].chartcounttaskslistbystatusList[j].listStatusInd ===
                  EnumSystemTaskStatus.STATUS_MONTHINSPECTION_CANCEL) { // Отменен
                  anyCanceled = chart[i].chartcounttaskslistbystatusList[j].counttasksbystatus > 0
                }
              }

            if ((!anyPlanned && !anyInProcess && !anyCanceled && !anyPerformed )
            || (anyPlanned && !anyInProcess && !anyCanceled && !anyPerformed)){
              pieRes[0].value = pieRes[0].value + 1

            }
            else if ((anyInProcess) || (anyPlanned && (anyPerformed || anyCanceled) )) {
              pieRes[1].value = pieRes[1].value + 1
            }
            else if ((anyPerformed || anyCanceled) && !anyInProcess && !anyPlanned){
              pieRes[2].value = pieRes[2].value + 1
            }

            // console.log(anyPlanned, anyInProcess, anyCanceled, anyPerformed);
          }
          // console.log("monObjectList", monObjectList)
          // console.log("chart", chart)

      monObjectList.forEach(el => {
        // console.log(el)
       if (el.active){
          let isFound = false;
          for (let i = 0; i < chart.length;  i ++) {
            if (el.ind === chart[i].monobjectind){
              isFound = true;
              break
            }
          }

          if (!isFound) {
            pieRes[0].value = pieRes[0].value + 1
          }
       }
      });

        observer.next(pieRes);
        // console.log("pieRes",pieRes)
      })
  })
}

public monthInspectionTaskList(year, period: number) {
  const sess = this.authService.getSess();
  const req = new MonthInspectionTaskListRequest();
  req.setYear(year);
  req.setPeriod(period);
  return new Observable(observer => {
    this.ChartServiceClient.monthInspectionTaskList(req, null, (err: grpcWeb.Error,
      response: MonthInspectionTaskListRes) => {
        if (err) {
          console.log()
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.tasklistList);
      })
  })
}


  public aggregateAutoInspection(){
    const sess = this.authService.getSess();
    const req = new GetChartCountTasksListByStatusRequest();
    // const req = new ExternalStatusCreateListByRootTypeListRequest();

    return new Observable(observer => {
      this.ChartServiceClient.getChartCountTasksListByStatus(req, null, (err: grpcWeb.Error,
        response: GetChartCountTasksListByStatusRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        let chartList: CountTasksByStatus.AsObject[] =  new Array();
        chartList = data.chartcounttaskslistbystatusList as CountTasksByStatus.AsObject[];
        const pieRes:  Array<any> = [];
        // return 4 status
        pieRes.push({
          name: 'Запланировано',
          value: 0
        });
        pieRes.push({
          name: 'Проведено',
          value: 0
        });
        pieRes.push({
          name: 'Отменен',
          value: 0
        });

        // aggregate  object


        chartList.forEach(chart => {
          if (chart.listStatusInd === EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_PLANNING){
            pieRes[0].value = chart.counttasksbystatus;
          }
          if (chart.listStatusInd === EnumSystemTaskStatus.STATUS_MONTHINSPECTION_AUTO_EXECUTE){
            pieRes[1].value = chart.counttasksbystatus;
          }
          if (chart.listStatusInd === EnumSystemTaskStatus.STATUS_MONTHINSPECTION_CANCEL){
            pieRes[2].value = chart.counttasksbystatus;
          }
        });

        observer.next(pieRes);
      });
    });
  }

  public aggregateTaskType(ATaskTypeInd: number, statusList: Array<DictStatus.AsObject>,
    monObjectInd: number = EnumSystemConst.MONOBJECT_ALL_IND){
    const sess = this.authService.getSess();
    const req = new ChartMonObjectListStateRequest();
    // const req = new ExternalStatusCreateListByRootTypeListRequest();

    req.setTaskTypeInd(ATaskTypeInd);

    return new Observable(observer => {
      this.ChartServiceClient.chartMonObjectListState(req, null, (err: grpcWeb.Error, response: ChartMonObjectListStateRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next();
          return;
        }

        const data = response.toObject();
        // console.log(data);

        let chartList: ChartSeriesValue.AsObject[] =  new Array();
        chartList = data.seriesValueListList as ChartSeriesValue.AsObject[];
        const pieRes:  Array<{
          name: string,
          value: number,
          ind: number,
        }> = [];
        for (let index = 0; index < statusList.length; index++) {
          pieRes.push({
            ind: statusList[index].ind,
            name: statusList[index].captionStatus,
            value: 0,
          });
        }
        // get summa of
        chartList.forEach(chart => {
          for (let i = 0; i < chart.valueListList.length; i ++){
            for (let index = 0; index < statusList.length; index++) {
              if (chart.valueListList[i].x === statusList[index].ind &&
                (monObjectInd === EnumSystemConst.MONOBJECT_ALL_IND || chart.seriesInd === monObjectInd)){
                const result = pieRes.find(item => item.ind === chart.valueListList[i].x);
                if (result){
                  result.value = result.value + chart.valueListList[i].y;
                } else {
                  pieRes.push({
                    name: statusList[index].captionStatus,
                    value: chart.valueListList[i].y,
                    ind: chart.valueListList[i].x,
                  });
                }
                break;
              }
            }
          }
        });
        observer.next(pieRes);
      });
    });
  }
  public aggregateMonitoringMonObject(){
    const sess = this.authService.getSess();
    const req = new ChartMonObjectListStateRequest();
    // const req = new ExternalStatusCreateListByRootTypeListRequest();

    req.setTaskTypeInd(EnumTaskType.TASK_TYPE_MONITORING);

    return new Observable(observer => {
      this.ChartServiceClient.chartMonObjectListState(req, null, (err: grpcWeb.Error, response: ChartMonObjectListStateRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next();
          return;
        }

        const data = response.toObject();
        // console.log(data);

        let chartList: ChartSeriesValue.AsObject[] =  new Array();
        chartList = data.seriesValueListList as ChartSeriesValue.AsObject[];
        const pieRes:  Array<any> = [];
        // return 4 status
        pieRes.push({
          name: 'Пожар',
          value: 0,
        });
        pieRes.push({
          name: 'Неисправность',
          value: 0
        });
        pieRes.push({
          name: 'Требует осмотра',
          value: 0
        });
        pieRes.push({
          name: 'Нoрма',
          value: 0
        });

        const pieMonObject:  Array<boolean> = new Array(4);
        const monObjectList:  Array<any> = new Array(4);
        // const pieColor:  Array<any> = new Array(4);
        for (let i = 0; i < 4;  i ++){
          monObjectList[i] = new Array();
        }
        // aggregate  object
        // console.log("list",chartList)

        chartList.forEach(chart => {
          let pieNumber = 100;
          for (let i = 0; i < 3;  i ++){
            pieMonObject[i] = false;
          }
          for (let i = 0; i < chart.valueListList.length; i ++){

            // add to fire
            if ((chart.valueListList[i].x === EnumSystemTaskStatus.STATUS_MONITORING_FIRE_STATE) && (chart.valueListList[i].y > 0)){
              pieNumber = 0;
              pieMonObject[0] = true;
            }
            if ((chart.valueListList[i].x === EnumSystemTaskStatus.STATUS_MONITORING_CRITICAL_STATE) && (chart.valueListList[i].y > 0)){
              if (pieNumber > 1) {
                pieNumber = 1;
              }
              pieMonObject[1] = true;
            }
            if (((chart.valueListList[i].x === EnumSystemTaskStatus.STATUS_MONITORING_DEFECT_STATE) ||
              (chart.valueListList[i].x === EnumSystemTaskStatus.STATUS_MONITORING_COMMUNICATION_ERROR_STATE) ||
              (chart.valueListList[i].x === EnumSystemTaskStatus.STATUS_MONITORING_ALARM_STATE) )
              && (chart.valueListList[i].y > 0)){
              if (pieNumber > 1) {
                pieNumber = 2;
              }
              pieMonObject[2] = true;
            }
          }
          if (pieNumber === 100){
            pieRes[3].value = pieRes[3].value + 1;
            monObjectList[3].push({
              ind: chart.seriesInd,
              caption: chart.caption
            });
          } else {
            pieRes[pieNumber].value = pieRes[pieNumber].value + 1;
            for (let i = 0; i < 3;  i ++){
              if (pieMonObject[i]){
                monObjectList[i].push({
                  ind: chart.seriesInd,
                  caption: chart.caption
                });
              }
            }
          }
        });

        // get color


        const res: any = {
          pie: pieRes,
          monCategory: monObjectList,
        };
        observer.next(res);
      });
    });
  }

  public get(statusIds, statusList: DictStatus.AsObject[]) {
    const sess = this.authService.getSess();
    const req = new ChartMonObjectListStateRequest();
    // const req = new ExternalStatusCreateListByRootTypeListRequest();

    req.setTaskTypeInd(EnumTaskType.TASK_TYPE_MONITORING);

    return new Observable(observer => {
      this.ChartServiceClient.chartMonObjectListState(req, null, (err: grpcWeb.Error, response: ChartMonObjectListStateRes) => {
        // console.log(response.toObject(), err);

        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }

        const data = response.toObject();
        console.log(data);

        setTimeout(() => {
          const result = {
            series: this.getData(data.seriesValueListList, statusIds, statusList),
            color: this.getColor(statusIds, statusList)
          };

          observer.next(result);
        }, 5000);

      });
    });
  }

  private getData(d, statusIds, statusList: DictStatus.AsObject[]) {
    const result = [];
    d.forEach(e => {
      const r = {
        name: e.caption,
        series: []
      };
      e.valueListList.forEach(i => {
        for (let idNumber = 0; idNumber < statusIds.length; idNumber ++)
        {
          if (i.x === statusIds[idNumber]){
            for (let statusNumber = 0; statusNumber < statusList.length; statusNumber ++)
           {
              if (statusList[statusNumber].ind === statusIds[idNumber]){
                r.series.push({
                  name: statusList[statusNumber].captionStatus,
                  value: i.y
                });
                break;
              }

            };
            break;
          }
        }

        // if (c.indexOf(i.x) !== -1) {
        //   r.series.push({
        //     name: statusList[i.x].captionStatus,
        //     value: i.y
        //   });
        // }
      });
      result.push(r);
    });
    return result;
  }

  private getColor(statusIds, statusList: DictStatus.AsObject[]) {
    const result = [];
    // console.log(statusIds);
    statusIds.forEach(id => {
      statusList.forEach(status => {
        if (status.ind === id){
          result.unshift(ChartMonObjectListStateService.dec2hexString(status.colorBackground));
        }
      });
    });
    return result;
  }
  private getColorForStatus(statusInd, statusList: DictStatus.AsObject[]) {
    const result = 0;
    statusList.forEach(status => {
      if (status.ind === statusInd){
        return ChartMonObjectListStateService.dec2hexString(status.colorBackground);
      }
    });
    return result;
  }

  // Антирейтинг
  public getAbandoned() {
    const sess = this.authService.getSess();
    const req = new GetAbandonedFaultsRequest();

    req.setStatusind(EnumSystemTaskStatus.STATUS_MONITORING_CRITICAL_STATE);
    req.setCounttasks(10);
    req.setSorttype('');

    return new Observable(observer => {
      this.ChartServiceClient.getAbandonedFaults(req, null, (err: grpcWeb.Error, response: GetAbandonedFaultsRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        // console.log(data);
        let count = 0;
        const result = [];
        data.tasksabandonedfaultswithdateList.forEach(el => {
            if(count < 10) {
              result.push({
                    link: '/search;apply_mask=2;rt=;mon_object_list=' + el.monobject.listMonobjectInd + ';status_list=-61',
                    monobjectInd:  el.monobject.listMonobjectInd,
                    name: el.monobject.caption,
                    value: el.countdayswithcrash,
                    taskcaption1: el.taskcaption,
                    series: [
                      {
                        name: '/search;apply_mask=2;rt=;mon_object_list=' + el.monobject.listMonobjectInd + ';status_list=-61',
                        value: el.countdayswithcrash,
                        tooltipText: el.taskcaption + ' ' + el.countdayswithcrash + ' дней'
                      }
                    ]
                  });
              }
              count ++;
        });
        observer.next(result);

      });
    });
  }

   // Кол-во дней без аварий
   public getDaysWithoutCrash() {
    const sess = this.authService.getSess();
    const req = new GetCountDaysWithoutCrashByMonObjRequest();


    return new Observable(observer => {
      this.ChartServiceClient.getCountDaysWithoutCrashByMonObj(req, null,
        (err: grpcWeb.Error, response: GetCountDaysWithoutCrashByMonObjRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        let count = 0;
        const result = [];
        data.countdayswithoutcrashbymonobjList.forEach(el => {
            if(count < 10) {
              result.push({
                    num:  el.countdayswithoutcrash,
                    name: el.monobject.caption,
                    series: [
                      {
                        name: '',
                        value: el.countdayswithoutcrash,
                      }
                    ]
                  });
              }
              count ++;
        });
        observer.next(result);
      });
    });
  }

  // Среднее время устранения SLA
  public TimeRepairsDefect(companyIndList: number[]) {
    const sess = this.authService.getSess();
    const req = new GetTimeRepairsDefectRequest();
    // const req1 = new GetOrganizationListRequest();

    req.setCompanyindListList(companyIndList);

    // req.setCountMonth(1);
    // var date = new Date;
    // var month = date.getMonth()+1;

    return new Observable(observer => {
      this.ChartServiceClient.getTimeRepairsDefect (req, null, (err: grpcWeb.Error, response: GetTimeRepairsDefectRes) => {
        // console.log(response.toObject(), err);
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.timerepairsdefecttypeList);
      });
    });
  }

  // Процент выполнения подрядчиком работ ТО
  public CompletedWorkByCompany() {
    const sess = this.authService.getSess();
    const req = new GetCompletedWorkByCompanyRequest();

    req.setCompanyindListList([]);

    return new Observable(observer => {
      this.ChartServiceClient.getCompletedWorkByCompany (req, null,
        (err: grpcWeb.Error, response: GetCompletedWorkByCompanyRes) => {
        if (err) {
          this.authService.errorHandler(err);
          observer.next([]);
          return;
        }
        const data = response.toObject();
        observer.next(data.completedworkbycompanyListList);
      });
    });
  }

  GetChartInfo() {
    const sess = this.authService.getSess();
    const req = new ChartAppInfoRequest();

    return new Observable(observer => {
      this.ChartServiceClient.chartAppInfo(req, null, (err: grpcWeb.Error, response: ChartAppInfoRes) => {
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

}


