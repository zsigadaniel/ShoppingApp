<template>
<!-- Reveals cart when the cart is clicked but only if there is at last 1 item in the cart -->
  <div class="cart-container" :class="{'reveal-cart':cartShow}">
    <!-- The cart -->
           <div class="cart">
             <!-- Total shown only if its not equal to 0 -->
                <div class="total" v-if="total!='$0'">
                  <p>Total:{{total}}</p>
                  <button>Place Order</button>
                 </div>
          <!-- Loops through the cart array to display the containing products added by the user-->
            <div class="cart-items" :key="car.id" v-for="(car, index) in cart">
              <!-- Product image -->
              <div class="image">
                <img :src=car[0] alt="">
              </div>
              <!-- All text in the cart -->
                <div class="cart-text">
                  <!-- product name -->
                    <h4>{{car[1]}}</h4>
                    <!-- product description -->
                    <p>{{car[2]}}</p>
                    <!-- total $ of the same product -->
                    <p v-if="!totalInputArray[index]">${{car[3]}}</p>
                    <p>{{totalInputArray[index]}}</p>
                    
                    <p>Curent Quantity:</p>
                    <input :id="index" type="text" :placeholder=car[4] v-model="tex[index]">

                    <button :id="index" @click="quantity_added">Update</button>
                    <button :id="index" @click="remover">Remove</button>
                </div>
           </div>
        </div>  
  
    </div>
</template>

<script>
//Helps with passing data betwen child elements
import {bus} from '../main'


export default {
  data(){
  return{
  name:'Cart',
    tex:[],//User input
  numbKeep:[],//Contains the actual numbers in order to have a total of all products in cart
  total:'',//Displays the total 
  cart:[],//The actual cart array containing the products added by the user
  cartShow:false,//State for revealing the cart or hiding it
  qtty:0,
  totalInputArray:[],//Responsible for holding the total for each product in the cart
  repeter:[],//Responsible for knowing the total quantity of each product in the cart -1 for each product. The -1 to the quantity of each product is there to help disconsider the cart.length (actual number of items in the cart array representing products) that is used togeter with repeter to display the total of products curently in the cart.
  }
},
methods:{
  // Controls the quantity input from the user for products in the cart
  quantity_added(e){
    // If input is not a number return
 if (isNaN(this.tex[e.target.id]))return;
 if (this.tex[e.target.id] % 1 !=0) return;
 //If input is undefined return 
 if(this.tex[e.target.id]==undefined)return;
 //Changes the quantity of the product inside the cart with what the user inputs based on it's position by using it's id
    this.cart[e.target.id][4] = this.tex[e.target.id];
    bus.$emit('qtty_add',[this.cart[e.target.id][4],this.cart[e.target.id][1]]);
    //Holds the total quantity of objects in the cart -1 to each product
  this.repeter[e.target.id]=parseFloat(this.cart[e.target.id][4]-1);
//Empties the user input and makes it clear for new input
    this.tex=[];
//Makes it so the product price updates based on the quantity added by the user
  let totalInput = parseFloat(this.cart[e.target.id][3]) * this.cart[e.target.id][4];
  this.totalInputArray[e.target.id] = '$'+ totalInput ;
  //Calls the function responsible for displaying the total sum in $ for all products added in the cart
  this.totalizator();
  },
  
  //Controls product removal
  remover(e){
    //Contains the removed product
    let removed= this.cart.splice(e.target.id,1);
    //Emits the product Id for further use in Products.vue
     bus.$emit('remId', [removed[0][1], removed[0][4]]);
     //Removes the object selected by the user from the array holding the value of products
     this.numbKeep.splice(e.target.id,1);
     //Removes the prices from the array helping to keep them displayed in order for each product
     this.totalInputArray.splice(e.target.id,1);
     //Regenerates a new total based on removed products
     this.total = '$'+ this.numbKeep.reduce((a,b)=>a+b,0);
     //Removes quantity of objects based on the product id selected by the user
     this.repeter.splice(e.target.id,1);
     this.tex=[];//Fixes a UI bug where if the user inputs a number and then removes the product the number jumps to the next product input
    //Emits an updated quantity for the cart
   bus.$emit('cartQtty', this.repeter.reduce((a,b)=>a+b,0)+this.cart.length);
   //Makes the cart close if the quantity of products inside is less then zero
    if(this.repeter.reduce((a,b)=>a+b,0)+this.cart.length>0)return;
    this.cartShow = false;
  },

//Controls the total sum of $ displayed in the cart and emits the cart quantity
  totalizator(){
    //Loops through the cart items
    let x;
    for(x in this.cart){
    //Emits an updated quantity for the cart
    bus.$emit('cartQtty',this.repeter.reduce((a,b)=>a+b,0)+this.cart.length);
    //Makes so the product price updates based on the quantity added by the user by clicking on "Add to cart"
    let totalInput = parseFloat(this.cart[x][3]) * this.cart[x][4];
    //Creates an array of all the prices * quantity added
    this.numbKeep[x] = totalInput;
    }
   this.total = '$'+ this.numbKeep.reduce((a,b)=>a+b,0);//The total creator
  },
},
created(){
  let x;
    bus.$on('cartItems', item=>{//Catches the product array sent from the Products component
    //Checks to see if what is in the cart matches with the user input so it only adds the products once and makes it so that multiple inputs by the user are stored only as value and quantity in the cart
      for(x in this.cart){
        //Matcher
         if(this.cart[x][1]==item[1]){
           //Quantity multiplyer
          this.cart[x][4]++;
    //Makes it so the product price updates based on the quantity added by the user
            let totalInput = parseFloat(this.cart[x][3]) * this.cart[x][4];
            this.totalInputArray[x] = '$'+ totalInput ;
             this.repeter[x]=parseFloat(this.cart[x][4]-1);
             //Calls the function responsible for displaying the total sum in $ 
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
   
   //Hides or reveals the cart contents
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
  z-index: 99;
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
      position: sticky;
      top: -1px;
      z-index: 99;
      background: #2c3e50;
      width: 100vw;
}
.cart{
    overflow: auto;
    width: 100%;
    max-height:70vh;
    .cart-items{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f1c40f;
    //Product image container
    .image{
      min-width: 100px;
      max-width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
     img{
      width: 80%;
      height: auto;
      margin-right: 5px;
      }
    }
   @supports (-ms-ime-align:auto) {
      img {
         min-width: 100px;
         height: max-content;
      }
    }
      @supports (-moz-appearance:none) {
      img {
        min-width: 120px;
        min-height: max-content;
      }
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
  .total{
         width: 583px;
  }
  .cart{
    width: 600px;
  }
}
</style>