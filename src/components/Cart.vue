<template>
  <div class="cart-container" :class="{'reveal-cart':cartShow}">
        <div class="cart">
          <!-- Loops through the cart array and creates the cart containing the products that have been added by the user-->
            <div class="cart-items" :key="car.id" v-for="(car, index) in cart">
                <img :src=car[0] alt="">
                <div class="cart-text">
                    <h4>{{car[1]}}</h4>
                    <p>{{car[2]}}</p>
                    <p v-if="!totalInputArray[index]">{{car[3]}}</p>
                    <p>{{totalInputArray[index]}}</p>
                    <p>Curent Quantity:</p>
                    <input :id="index" type="text" :placeholder=car[5] v-model="tex[index]">
                    <button :id="index" @click="quantity_added">Update</button>
                    <button :id="index" @click="remover">Remove</button>
                </div>
           </div>
          
        </div>
            <div class="total" v-if="total!='0$'">
                  <p>Total:{{total}}</p>
                  <button>Place Order</button>
              </div>
  </div>
</template>

<script>
//Helps with passing data betwen child elements
import {bus} from '../main'

export default {
  data(){
  return{
  tex:[],
  name:'Cart',
  numbKeep:[],//Contains the actual numbers in order to have a total of all products in cart
  total:'',//Displays the total 
  cart:[],//The actual cart array containing the products added by the user
  cartShow:false,
  qtty:0,
  totalInputArray:[],
  repeter:[],
  }
},
methods:{
  // Controls the quantity input from the user for products in the cart
  quantity_added(e){
    // If input is not a number return
 if (isNaN(this.tex[e.target.id]))return;
 //If input is undefined return 
 if(this.tex[e.target.id]==undefined)return;
 //Changes the quantity of the product inside the cart based on its position by using its id with what the user inputs
    this.cart[e.target.id][5] = this.tex[e.target.id];
    bus.$emit('qtty_add',[this.cart[e.target.id][5],this.cart[e.target.id][1]]);
    //Holds the total quantity of objects in the cart
  this.repeter[e.target.id]=parseFloat(this.cart[e.target.id][5]-1);
//Empties the user input and makes it clear for a new one
    this.tex=[];
//Makes so the product price updates based on the quantity added by the user
  let totalInput = parseFloat(this.cart[e.target.id][3]) * this.cart[e.target.id][5];
  this.totalInputArray[e.target.id] = totalInput  + '$';
  //Calls the function responsible for displaying the total sum in $ for all products added in the cart
  this.totalizator();
  },
  
  //Controls product removal
  remover(e){
    //Contains the removed product
    let removed= this.cart.splice(e.target.id,1);
    //Emits the product Id for further use in Products.vue
     bus.$emit('remId', [removed[0][1], removed[0][5]]);
     //Removes the object selected by the user from the array holding the value of products
     this.numbKeep.splice(e.target.id,1);
     //Removes the prices from the array helping to keep them displayed in order for each product
     this.totalInputArray.splice(e.target.id,1);
     //Regenerates a new total based on removed products
     this.total = this.numbKeep.reduce((a,b)=>a+b,0) + '$';
     //Removes quantity of objects based on the product id selected by the user
     this.repeter.splice(e.target.id,1);
     //Emits a the new quantity of the cart so it updates based on what is removed
   bus.$emit('cartQtty', this.repeter.reduce((a,b)=>a+b,0)+this.cart.length);
   //Makes the cart close if the quantity of products inside is less then zero
    if(this.repeter.reduce((a,b)=>a+b,0)+this.cart.length>0)return;
    this.cartShow = false;
  },

//Controls the total sum of $ displayed in the cart
  totalizator(){
    //Emits an updated quantity for the cart
  
    //Loops through the cart items
    let x;
    for(x in this.cart){
    bus.$emit('cartQtty',this.repeter.reduce((a,b)=>a+b,0)+this.cart.length);
  //Makes so the product price updates based on the quantity added by the user by clicking on "Add to cart"
    let totalInput = parseFloat(this.cart[x][3]) * this.cart[x][5];
    //Creates an array all the prices * quantity added
    this.numbKeep[x] = totalInput;
    }
   this.total = this.numbKeep.reduce((a,b)=>a+b,0) + '$';//The total creator
  },
},
created(){
  let x;
    bus.$on('cartItems', item=>{//Catches the product array sent from the Products component
    //Checks to see if what is in the cart matches with the user input so it only adds the products once and makes multiple inputs by the user stored only as value and quantity in the cart
      for(x in this.cart){
        //Matcher
         if(this.cart[x][1]==item[1]){
           //Quantity multiplyer
          this.cart[x][5]++;
    //Makes so the product price updates based on the quantity added by the user
            let totalInput = parseFloat(this.cart[x][3]) * this.cart[x][5];
            this.totalInputArray[x] = totalInput  + '$';
             //Calls the function responsible for displaying the total sum in $ for all products added in the cart
             this.repeter[x]=parseFloat(this.cart[x][5]-1);
          this.totalizator();
          //To prevent multyple products entering the cart
           return;
       }
      }
          //Pushes the array in the cart array
      this.cart.push(item);
           //Added in case of singular inputs
      this.totalizator();
    });
   
  bus.$on('showCart',qtty=>{
      this.qtty = qtty;
          this.cartShow = !this.cartShow
    })
}
}
</script>

<style lang="scss" scoped>

@mixin resize{
  @media screen and (min-width:600px){
    @content
  }
};

.cart-container{
  background: #2c3e50;
  color: #f1c40f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 70px;
  max-height:0;
  overflow: hidden;
  transition: 0.4s ease-in-out;
  border-top: 1px solid #f1c40f;
   button{
    border:none;
    padding: 5px;
    color: #2c3e50;
    background:#f1c40f;
    font-weight: bold;
    width: 90px;
    height: 25px;
    margin-top: 5px;
    transition: 0.3s ease-in-out;
  }
  button:hover{
    background:#2c3e50;
    color: #f1c40f;
    border:1px solid #f1c40f;
    transition: 0.3s ease-in-out;
  }
}
.reveal-cart{
  max-height:100%;
  transition: 0.4s ease-in-out;
}
   .total{
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
      margin-top: 10px;
      padding-bottom: 10px;
    }
.cart{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 5px;
  width: 100%;
    .cart-items{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    // flex-direction: column;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f1c40f;
      img{
      width: 25%;
      height: auto;
      margin-right: 5px;
      }
    }
    .cart-text{
      display: flex;
      flex-direction: column;
    }
    input{
      width: 35px;
    }
    input::placeholder{
      color: #2c3e50;
    }
}
@include resize{
  .cart{
    width: 600px;
  }
}
</style>