import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl="http://localhost:49800/api/checkout/purchase";
  constructor(private httpClien: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any>{
    return this.httpClien.post<Purchase>(this.purchaseUrl,purchase);
  }
}
