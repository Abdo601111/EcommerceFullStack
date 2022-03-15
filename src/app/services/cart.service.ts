import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

cartItems: CartItem[]=[];
totalPrice: Subject<number> =new BehaviorSubject<number>(0);
totalQuantity: Subject<number> =new BehaviorSubject<number>(0);
  constructor() { }

  addToCartItem(theCartItems: CartItem){

    let alreadyExistInCart: boolean=false;
    let existingCartItem: CartItem=undefined;

    if(this.cartItems.length>0){

      // for(let tempCartItem of this.cartItems){
      //     if(tempCartItem.id===theCartItems.id){
      //       existingCartItem=tempCartItem;

      //     }
      // }
      existingCartItem = this.cartItems.find(tempItem => tempItem.id === theCartItems.id);
      alreadyExistInCart= (existingCartItem != undefined);
    }
     
      if(alreadyExistInCart){
        existingCartItem.quantity++;
      }else{
        this.cartItems.push(theCartItems);
      }
      this.computeCartTotal();

    
  }
  computeCartTotal() {
    let totalPriceValue: number=0;
    let totalQuanityValue: number=0;
   for(let currentCartItem of this.cartItems){
    totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
    totalQuanityValue += currentCartItem.quantity;
   }
   this.totalPrice.next(totalPriceValue);
   this.totalQuantity.next(totalQuanityValue);
   this.logCartData(totalPriceValue,totalQuanityValue);
  }
  logCartData(totalPriceValue: number, totalQuanityValue: number) {
    for(let tempCartItem of this.cartItems){
      const subTotal=tempCartItem.quantity*tempCartItem.unitPrice;
      
    }
  }

  decrementQuantity(tempCart: CartItem) {
    tempCart.quantity--;
    if(tempCart.quantity===0){
      this.remove(tempCart);
    }else{
      this.computeCartTotal();
    }
  }
  remove(tempCart: CartItem) {
    const cartIndex= this.cartItems.findIndex(tt => tt.id === tempCart.id);

    if(cartIndex >-1){
       this.cartItems.splice(cartIndex,1);
       this.computeCartTotal();
    }
  }
}
