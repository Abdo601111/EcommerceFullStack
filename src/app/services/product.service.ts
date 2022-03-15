import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  
  

  private baseUrl = 'http://localhost:49800/api/products';
  private categoryUrl = 'http://localhost:49800/api/product-category';
  

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number):  Observable<Product>{
     const productUrl=`${this.baseUrl}/${theProductId}`;
     return this.httpClient.get<Product>(productUrl);
  }


  getProductListPagination(thePage: number,thePagesize: number
    ,currentCategoryId: number): Observable<GetResponse> {

    const searchUrl= `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`
    +`&page=${thePage}&size=${thePagesize}`;

    return this.httpClient.get<GetResponse>(searchUrl);
  }




  getProductList(currentCategoryId: number): Observable<Product[]> {

    const searchUrl= `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl= `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


}

interface GetResponse {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    taotalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

