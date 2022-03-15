import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

checkoutFormGroup: FormGroup;
totalPrice: number;
totalQuantity: number;
creditCardYears: number [] = [];
creditCardMonth: number [] = [];
countries: Country[]=[];
shippingAddressState: State[]=[];
billingAddressState: State[]=[];

  constructor(private formBilder: FormBuilder,private luv2ShopService: Luv2ShopFormService
    ,private cartService: CartService
    ,private checkoutService: CheckoutService
    ,private router: Router) { }

  ngOnInit(): void {

    this.reviewCardDetails();
    this.checkoutFormGroup=this.formBilder.group({
      customer: this.formBilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),



      shippingAddress: this.formBilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),

      billingAddress: this.formBilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),

      creditCard: this.formBilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYesrs: [''],
      }),
    });

    let startMonth: number = new Date().getMonth()+1;
    console.log("Credit Card Month"+startMonth);
    this.luv2ShopService.getCreditCardMonth(startMonth).subscribe(
      data =>{
        console.log("Credit Card Month"+JSON.stringify(data));
        this.creditCardMonth=data;
      }
    );

    this.luv2ShopService.getCreditcardYears().subscribe(
      data =>{
        console.log("Credit Card Years"+JSON.stringify(data));
        this.creditCardYears=data;
      }
    );
    this.luv2ShopService.getCountries().subscribe(
      data => {
        this.countries=data
      }
    )
  }
  reviewCardDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQ => this.totalQuantity=totalQ
    )
    this.cartService.totalPrice.subscribe(
      tp => this.totalPrice=tp
    )
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  onSubmit(){
    console.log(this.checkoutFormGroup.get('customer').value);

    // if(this.checkoutFormGroup.invalid){
    //   this.checkoutFormGroup.markAllAsTouched();
    //   return;
    // }

    let order = new Order();
    order.total_price=this.totalPrice;
    order.total_quantity= this.totalQuantity;
    const cardItems= this.cartService.cartItems;

    let orderItems: OrderItem[]=[];

    for(let i=0;i<cardItems.length;i++){
      orderItems[i] = new  OrderItem(cardItems[i]);
    }

    let orderItemsShort: OrderItem[]=cardItems.map(tempitems => new OrderItem(tempitems));

    let purchase= new Purchase();

    purchase.customer= this.checkoutFormGroup.controls['customer'].value;


    purchase.shippingAddress= this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state=shippingState.name;
    purchase.shippingAddress.country=shippingCountry.name;


    purchase.billingAddress= this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state=billingState.name;
    purchase.billingAddress.country=billingCountry.name;

    purchase.order=order;
    purchase.orderItems=orderItems;
    
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your Order has Be Recovird .\n Order Tracking Number :  ${response.orderTrackimgNumber}`);
           this.resetCart();
        },
        error: err =>{
          alert(`There Was And Error ${err.message}`);
        }
      }
    );


  }
  resetCart() {
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next[0];
    this.cartService.totalQuantity.next[0];

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  copyShippingAndAddress(event){
  if(event.target.checked){
   
    this.checkoutFormGroup.controls.billingAddress
    .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    
  }else{
    this.checkoutFormGroup.controls.billingAddress.reset();
  }
  }


  handelMonthAndYears(){
    const creditCardFromGroup= this.checkoutFormGroup.get('creditCard');
    let currentYear: number=new Date().getFullYear();
    let selectYear: number=Number(creditCardFromGroup.value.expirationYesrs);
    let strtMonth: number;

    if(currentYear === selectYear){
      strtMonth=new Date().getMonth()+1;
    }else{
      strtMonth=1;
    }
    this.luv2ShopService.getCreditCardMonth(strtMonth).subscribe(
      data => {
        this.creditCardMonth=data;
      }
    )
  }

  getStates(shippingAddress: string){

    const formGroup= this.checkoutFormGroup.get(shippingAddress);
    const countryCode=formGroup.value.country.code;
    const countryName=formGroup.value.country.name;
    
    this.luv2ShopService.getState(countryCode).subscribe(
      data =>{
        if(shippingAddress==='shippingAddress'){
          this.shippingAddressState=data
        }else{
          this.billingAddressState=data
        }
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

}
