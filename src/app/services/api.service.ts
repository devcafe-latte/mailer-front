import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headers: any = {
    'X-Client-Name': 'mailer-front',
    'X-Client-Version': '1',
  };

  constructor(
    private http: HttpClient,
    private store: StoreService,
  ) { }

  public setToken(token: string) {
    this.headers.Authorization = `bearer ${token}`;
  }

  public unsetToken() {
    delete this.headers.Authorization;
  }

  public async get(path: string): Promise<any> {
    return this.http
      .get(environment.api + path, { headers: this.headers })
      .toPromise()
      .then(response => this.handleCommonResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  public async delete(path: string): Promise<any> {
    return this.http
      .delete(environment.api + path, { headers: this.headers })
      .toPromise()
      .then(response => this.handleCommonResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  public async put(path: string, body: any): Promise<any> {
    return this.http
      .put(environment.api + path, body, { headers: this.headers })
      .toPromise()
      .then(response => this.handleCommonResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  public async patch(path: string, body: any): Promise<any> {
    return this.http
      .patch(environment.api + path, body, { headers: this.headers })
      .toPromise()
      .then(response => this.handleCommonResponse(response))
      .catch((err) => this.handleErrors(err));
  }

  public async post(path: string, body: any): Promise<any> {
    return this.http
      .post(environment.api + path, body, { headers: this.headers })
      .toPromise()
      .then(response => this.handleCommonResponse(response))
      .catch((err) => this.handleErrors(err))
  }

  private handleCommonResponse(response: any) {
    if (!response) return response;
    //For later use perhaps
    return response;
  }

  private async handleErrors(e: HttpErrorResponse) {
    await this.handleCommonResponse(e.error);
    if (e.status === 500) {
      //this.toasts.warning("errors.unknown");
      console.error("Internal Server Error", e);
    } else if (e.status === 0) {
      //this.toasts.warning("errors.service-down");
      console.error("Service is down", e);
    }
    console.log("HttpResponse error", e);
    throw e;
  }
}
