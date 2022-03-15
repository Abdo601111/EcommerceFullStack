import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countryUrl='http://localhost:49800/api/countries';
  private stateUrl='http://localhost:49800/api/states';

  constructor(private httpClien: HttpClient) { }


  getCountries(): Observable<Country[]>{
    return this.httpClien.get<GetResponseCountry>(this.countryUrl).pipe(
      
      map(response => response._embedded.countries)
      
    );
  }


  
  getState(theCountryCode: string): Observable<State[]>{

    const searchStateUrl=`${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClien.get<GetResponseState>(searchStateUrl).pipe(
      
      map(response => response._embedded.states)
    );
  }



  getCreditCardMonth(startMonth: number): Observable<number[]>{
let data: number[]=[];
for(let theMonth=startMonth;theMonth<=12;theMonth++){
data.push(theMonth);
}
return of(data);
  }

  getCreditcardYears(): Observable<number[]>{
    let data: number [] = [];
    let startYear: number= new Date().getFullYear();
    let endYear: number=startYear+10;
    for(let theYear = startYear ; theYear <= endYear ; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}
 interface GetResponseCountry{
  _embedded: {
    countries: Country[];
    
  }
 }

 interface GetResponseState{
  _embedded: {
    states: State[];
  }
 }