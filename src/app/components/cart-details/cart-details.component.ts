import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {


cartItem: CartItem[]=[];
totalPrice: number=0;
totalQuantity: number=0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.listCartDetails();
  }
  listCartDetails() {
    this.cartItem=this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(

      data => this.totalPrice=data
    );

    this.cartService.totalQuantity.subscribe(

      data => this.totalQuantity=data
    );

    this.cartService.computeCartTotal();
  }


  incrementQuantity(tempCart: CartItem){
this.cartService.addToCartItem(tempCart);
  }
  decrementQuantity(tempCart: CartItem){
    this.cartService.decrementQuantity(tempCart);
  }

  remove(tempCart: CartItem)
{
this.cartService.remove(tempCart);

}
}
