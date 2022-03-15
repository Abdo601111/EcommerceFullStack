import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number=1;
  searchMode: boolean=false;
  thePageNumber: number=1;
  thePageSize: number=10;
  theTotalElements: number=0;
  previousCategoryId: number=1;
  
  constructor(private productService: ProductService,
    private route: ActivatedRoute,private cartService: CartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
  
  }

  listProducts() {
this.searchMode=this.route.snapshot.paramMap.has('keyword');
if(this.searchMode){
this.handleSearchProduct();
}else{
  this.handleListProduct();

}
    
  }


  handleSearchProduct(){
const theKeyword= this.route.snapshot.paramMap.get('keyword');
this.productService.searchProducts(theKeyword).subscribe(
  data => {
    this.products = data;
  }
)


  }

  handleListProduct(){

    const hasCategoryId: boolean=this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = + this.route.snapshot.paramMap.get('id');
    }else{
      this.currentCategoryId=1;
    }

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }
    this.previousCategoryId=this.currentCategoryId;

    this.productService.getProductListPagination(this.thePageNumber -1,
      this.thePageSize,this.currentCategoryId).subscribe(this.processResult());

  }
  processResult(){
    return data =>{
      this.products = data._embedded.products;
      this.thePageNumber=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements= data.page.totalElements;
    }
  }


  addToCart(tempProduct: Product){
const theCartItems= new CartItem(tempProduct);
this.cartService.addToCartItem(theCartItems);
  }

}