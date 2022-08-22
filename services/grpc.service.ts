import { Injectable } from '@angular/core';
import { ClientServiceClient } from '@api/SittelleServiceClientServiceClientPb';
import { ChartServiceClient } from '@api/SittelleServiceChartServiceClientPb';
import { DictionaryClient } from '@api/SittelleServiceDictionaryServiceClientPb';
import { ReportClient } from '@api/SittelleServiceReportServiceClientPb';
import { TunerClient } from '@api/TunerServiceClientPb';
import { AuthorizationClient } from '@api/SittelleServiceAuthorizationServiceClientPb';
import { HistoryServiceClient } from '@api/SittelleServiceHistoryServiceClientPb';
import { LoginFormComponent } from '@projectApp/components/login-form/login-form.component';
import { EquipoClient } from '@api/EquipoServiceClientPb';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
// import { NoopInterceptor2 } from '@projectApp/authInterceptor/authInterceptor';
import { CookieService } from './cookie.service';
import { AuthInterceptor } from '@projectApp/authInterceptor/authInterceptor';
// import { AuthInterceptor, SimpleUnaryInterceptor } from '@projectApp/authInterceptor/authInterceptor';

@Injectable({
  providedIn: 'root'
})
export class GrpcService {
  public ClientServiceClient: ClientServiceClient;
  public ChartServiceClient: ChartServiceClient;
  public DictionaryServiceClient: DictionaryClient;
  public ReportServiceClient: ReportClient;
  public TunerClient: TunerClient;
  public EquipoClient: EquipoClient;
  public DictionaryClient: DictionaryClient;
  public AuthorizationClient: AuthorizationClient;
  public HistoryServiceClient: HistoryServiceClient;
  public LoginFormComponent: LoginFormComponent;

  private host = '';
  private options

  constructor(private cookie: CookieService) {


    if (environment.host === ''){
      this.host = 'https://' + window.location.hostname;
    } else {
      this.host = 'https://' + environment.host
    }
    // console.log(window.location);
    // console.log(this.host);
    this.options = {
      streamInterceptors: [new AuthInterceptor(this.cookie.get('sid') || '')]
    }

    if (!this.ClientServiceClient) {
      this.ClientServiceClient = new ClientServiceClient(this.host, null, this.options);
    }
    if (!this.AuthorizationClient) {
      this.AuthorizationClient = new AuthorizationClient(this.host, null, this.options);
    }
    if (!this.ChartServiceClient) {
      this.ChartServiceClient = new ChartServiceClient(this.host, null, this.options);
    }
    if (!this.DictionaryServiceClient) {
      this.DictionaryServiceClient = new DictionaryClient(this.host, null, this.options);
    }
    if (!this.ReportServiceClient) {
      this.ReportServiceClient = new ReportClient(this.host, null, this.options);
    }
    if (!this.TunerClient) {
      this.TunerClient = new TunerClient(this.host, null, this.options);
    }
    if (!this.EquipoClient) {
      this.EquipoClient = new EquipoClient(this.host, null, this.options);
    }
  }
}

