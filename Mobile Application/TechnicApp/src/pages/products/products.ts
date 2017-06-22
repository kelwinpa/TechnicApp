import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Product } from '../../providers/product';
import { GenerateService } from '../generate-service/generate-service';


@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class Products {

  host : any;
  user : any;
  
  searchQuery: string = '';
  items: string[];
  
  productsInitial = []; 
  products = []; 
  searchProductString = '';
  
  filter : string[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public product: Product) {
   
     storage.ready().then(() => {
       storage.get('hostserver').then((val) => {
        this.host = val; 
        console.log("hostserver : "+val);       
       }),
       storage.get('user').then((val) => {
            this.user = val;
            console.log("user : "+val);

            this.product.productList(this.user.id_category, this.host).subscribe(
                data => {
                    this.productsInitial = data;
                    this.products = data;
                    console.log(data);
                },
                err => {
                    console.log(err);
                }
            ); 
       })
     });
  }

  ionViewWillEnter(){
    if(this.host!=null && this.user != null){
        this.storage.ready().then(() => {
          this.storage.get('user').then((val) => {
                this.user = val;

                this.product.productList(this.user.id_category, this.host).subscribe(
                    data => {
                        this.productsInitial = data;
                        this.products = data;
                        console.log(data);
                    },
                    err => {
                        console.log(err);
                    }
                ); 
          })
        }); 
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Products');
  }
  
  assignCopy(){
    this.products = Object.assign([], this.productsInitial);
  }
  
  searchProduct(event) {
        
        if( this.productsInitial[0].error == "1")return ;

        let value = "";
        if(event.type != "mousedown"){
          value = event.srcElement.value;
        }
        
        if(value == "") this.assignCopy();
        
        this.products = Object.assign([], this.productsInitial).filter(
          item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        )
  }
  
  selectedItem(product){
    this.navCtrl.push(GenerateService, {
      product: product
    });
  }

}
