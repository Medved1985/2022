
import { EnumEventStatus, EnumMeasureValueType, EnumReglamentActivationMode,
  EnumReglamentPeriodicity, EnumTaskSituation, EnumTaskStatus } from '@projectApp/api/typeConst_pb';
import * as CommonTypes from '@projectApp/common/common-types';
import { ThemeType } from '@projectApp/theme/theme.service';
import * as environment from '../../environments/environment';


export type TDictionary = {
  id: number,
  caption: string,
  checked?: boolean,
  color?:string
}

export const measureTypeList: TDictionary[] = [
  { caption: 'Числовое', id: EnumMeasureValueType.MEASURE_VALUE_TYPE_NUMBER},
  { caption: 'Логическое', id: EnumMeasureValueType.MEASURE_VALUE_TYPE_LOGICAL},
];

export const reglamentStatusRegList = [
  { caption: 'Не активен', id: false},
  { caption: 'Активен', id: true },
];

export const reglamentPeriodicityList: TDictionary[] = [
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_THREE_YEAR, caption: '1 раз в 3 года' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_YEAR, caption: '1 раз в год' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_TWO_IN_YEAR, caption: '2 раза в год (летом и зимой)' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_THREE_MONTH, caption: '1 раз в 3 месяца' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_MONTH, caption: '1 раз в месяц' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_WEEK, caption: '1 раз в неделю' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_TWO_IN_WEEK, caption: '2 раза в неделю' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_TEN_DAYS, caption: '1 раз в 10 дней' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_FIVE_DAYS, caption: '1 раз в 5 дней' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_THREE_DAYS, caption: '1 раз в 3 дня' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_DAY, caption: '1 раз в день' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_TWO_IN_DAY, caption: '2 раза в день' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_ONE_IN_WORK_SHIFT, caption: '1 раз за смену' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_TWO_IN_WORK_SHIFT, caption: '2 раза за смену' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_BEFORE_WORKING_DAY, caption: 'до начала работы' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_BEFORE_AFTER_WORK_SHIFT, caption: 'при сдаче-приемке смены' },
  { id: EnumReglamentPeriodicity.REGLAMENT_PERIODICITY_IN_AFTER_WORK_SHIFT, caption: 'при обходе во время смены и при сдаче смены' },
];

export const eventStatusList: TDictionary[] = [
  { caption: 'Не обработано', id: EnumEventStatus.EVENT_STATUS_NOT_PROCESSED, color: '#e9ebec' },
  { caption: 'Наблюдение', id: EnumEventStatus.EVENT_STATUS_OBSERVATION, color: '#fef3dc' },
  { caption: 'Привязано к заданию', id: EnumEventStatus.EVENT_STATUS_LINKED, color: '#dceeff' },
  { caption: 'Обработано', id: EnumEventStatus.EVENT_STATUS_PROCESSED, color: '#e5f6dd' },
  { caption: 'Создано ошибочно', id: EnumEventStatus.EVENT_STATUS_ERRONEOUS, color: '#ffe4e5' },
];

export const taskStatusList: TDictionary[] = [
  { caption: 'Не назначено', id: EnumTaskStatus.TASK_STATUS_NOT_PROCESSED},
  { caption: 'В работе', id: EnumTaskStatus.TASK_STATUS_EXECUTE},
  { caption: 'Выполнено', id: EnumTaskStatus.TASK_STATUS_DONE},
  { caption: 'Отменено', id: EnumTaskStatus.TASK_STATUS_CANCELLED},
];

export const eventSituationList: TDictionary[] = [
  { caption: 'Не является угрозой', id: EnumTaskSituation.TASK_SITUATION_NOT_HAZARD, checked: false },
  { caption: 'Угроза', id: EnumTaskSituation.TASK_SITUATION_HAZARD, checked: false },
  { caption: 'Предаварийная ситуация', id: EnumTaskSituation.TASK_SITUATION_PRE_EMERGENCY, checked: false },
  { caption: 'Авария', id: EnumTaskSituation.TASK_SITUATION_ACCIDENT, checked: false },
  { caption: 'Чрезвычайная ситуация', id: EnumTaskSituation.TASK_SITUATION_EMERGENCY, checked: false },
  { caption: 'Не определено', id: EnumTaskSituation.TASK_SITUATION_NOT_DETERMINED, checked: false },
];

export const reglamentActivationList: TDictionary[] = [
  { caption: 'Ручной', id: EnumReglamentActivationMode.REGLAMENT_ACTIVATION_MODE_MANUAL },
  { caption: 'Автоматический', id: EnumReglamentActivationMode.REGLAMENT_ACTIVATION_MODE_AUTO },
];

export const reglamentStatusList: TDictionary[] = [
  { caption: 'Активен', id: 1 },
  { caption: 'Не активен', id: 0 },
];
