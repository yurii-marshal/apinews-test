import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Params } from '../../dashboard/models/params.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public categories = [];
  public countries = [];
  private countriesList = [];

  constructor(
    private httpClient: HttpClient
  ) {
    this.countriesList = this.getCountriesList();

    this.getSources().subscribe((data) => {
      const categoriesUniq = [...new Set(data.sources.map(item => item.category))];
      const countriesUniq = [...new Set(data.sources.map(item => item.country))];

      this.categories = categoriesUniq.map((item: string) => {
        return {
          label: item,
          value: item
        };
      });

      this.countries = countriesUniq.map((item: string) => {
        return {
          label: this.countriesList.find(country => country.alpha2Code.toLowerCase() === item)?.name,
          value: item
        };
      });
    });
  }

  public getNews(params: Params): Observable<any> {
    return this.httpClient
      .get(`${environment.url}/top-headlines?language=en` + this.stringifyParams(params))
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  private getCountriesList(): any {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', 'https://restcountries.eu/rest/v2/all', false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
  }

  private getSources(): Observable<any> {
    return this.httpClient
      .get(`${environment.url}/sources?`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  private stringifyParams(params: Params) {
    let urlParams = '';

    Object.keys(params).forEach(key => {
      if (params[key]) {
        urlParams += `&${key}=${params[key]}`;
      }
    });

    return urlParams;
  }
}
