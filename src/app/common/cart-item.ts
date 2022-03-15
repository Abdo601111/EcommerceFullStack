import { Product } from './product';

export class CartItem {

    id: string;
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;

    constructor(private product: Product){

        this.id=this.product.id;
        this.name=this.product.name;
        this.imageUrl=this.product.imageUrl;
        this.unitPrice=this.product.unitPrice;
        this.quantity=1;

    }
}
