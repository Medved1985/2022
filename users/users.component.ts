import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  listOfData = [
    {
      key: '1',
      name: 'Ковалев Сергей Михайлович',
      position: 'Исполнительный директор',
      department: 'Совет директоров',
      role: 'Директор'
    },
    {
      key: '2',
      name: 'Вайсман Милена Абрамовна',
      position: 'Генеральный директор',
      department: 'Генеральный директор',
      role: 'Директор'
    },
    {
      key: '3',
      name: 'Самойлов Роман Генадьевич',
      position: 'Специалист технической поддержки',
      department: 'Департамент персонала',
      role: 'Специалист технической поддержки'
    }
  ];
  data = [
    {group_name: 'Общие данные', url: 'main', group: [
        {rus_name: 'Ф.И.О.', value: 'Ковалев Сергей Михайлович'},
        {rus_name: 'Наименование юр. лица', value: 'ООО "СМИС Эксперт"'},
        {rus_name: 'Должность', value: 'Исполнительный директор'},
        {rus_name: 'Департамент', value: 'Совет директоров'},
        {rus_name: 'Роль', value: 'Директор'},
        {rus_name: 'Профиль роли', value: 'Техническая поддержка'},
        {rus_name: 'Экспертность', value: 'Техническая поддержка'},
        {rus_name: 'Доступ в систему', value: 'Разрешен'}
      ]},
    {group_name: 'Контактные данные', url: 'contact', group: [
        {rus_name: 'Телефон', value: '+7 (495) 532-52-62 доб. 702'},
        {rus_name: 'Телефон 2', value: '+7 (495) 000-00-00'},
        {rus_name: 'E-mail', value: 's.m.kovalev@bk.ru'}
      ]},
  ];
  data2 = [
    {group_name: 'Общие данные', url: 'main', group: [
        {rus_name: 'Ф.И.О.', name: 'name1', type: 1, value: 'Ковалев Сергей Михайлович'},
        {rus_name: 'Наименование юр. лица', name: 'name2', type: 1, value: 'ООО "СМИС Эксперт"'},
        {rus_name: 'Должность', name: 'name3', type: 1, value: 'Исполнительный директор'},
        {rus_name: 'Департамент', name: 'name4', type: 1, value: 'Совет директоров'},
        {rus_name: 'Роль', name: 'name5', type: 6, value: ['Директор'], options: [
            'Диспечер', 'Менеджер по ТО', 'Менеджер по ТР', 'Директор', 'Администратор', 'Специалист технической поддержки'
          ]},
        {rus_name: 'Профиль роли', name: 'name6', type: 6, value: ['Техническая поддержка'], options: [
            'Управление персоналом', 'Техническая поддержка', 'Профиль 2', 'Профиль 3', 'Профиль 4', 'Профиль 5'
          ]},
        {rus_name: 'Экспертность', name: 'name7', type: 6, value: ['Техническая поддержка'], options: [
            'PR', 'Маркетинг', 'техническая поддержка', 'Область 2', 'Область 3', 'Область 4', 'Область 5'
          ]},
        {rus_name: 'Доступ в систему', name: 'name8', type: 2, value: '1', options: [
            {label: 'Разрешен', value: '1'},
            {label: 'Запрещен', value: '0'},
          ]}
      ]},
    {group_name: 'Контактные данные', url: 'contact', group: [
        {rus_name: 'Телефон', name: 'name9', type: 4, value: ['+7 (495) 000-00-00']},
        {rus_name: 'Телефон 2', name: 'name10', type: 4, value: ['+7 (495) 000-00-00']},
        {rus_name: 'E-mail', name: 'name11', type: 4, value: ['user@example.com']}
      ]},
  ];
  param: {[key: string]: number} = {};
  breadcrumbData = [
    {name: 'Пользователи'},
    {name: 'Ковалев Сергей Михайлович'},
  ];
  isEdit = false;
  constructor(private route: Router, private r: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.url.indexOf('edit') != -1) this.isEdit = true;
    this.param = this.r.snapshot.params;
  }

}
