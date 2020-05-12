<template>
  <div id="header" @click="hider">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_O_Preview_Logo.png" alt="Should be a image with a logo here">
        <div class="shop-cart" @click="showCart">
            <p class="counter">{{cartQtty}}</p>
            <i class="fas fa-shopping-cart"></i>
        </div>
    <Hamburger class="hamburger" @reveal-cat="revealCat"/>
    <div class="container-categ">
          <div class="categories" :class="{'reveal-categ':catReveal}">
              <h2>Categories</h2>
                <div class="product_names" :key="pro" v-for="pro in product_name">
                    <h4 :id="pro" @click="id_passer">{{pro}}</h4>
                </div>
         </div>
    </div>
  </div>
</template>

<script>
import Hamburger from './Hamburger';
//Helps with passing data betwen child elements
import {bus} from '../main';

export default {
  name:'Header',
  components:{
    Hamburger,
  },
data(){
  return{
    catReveal:false,
    categNam:[],
    nam:[],
    product_name:[],
    cartQtty:0,
    catIndex:0,
  }
},
methods:{
  revealCat(){
    this.catReveal= !this.catReveal; //Reveals categories menu
  },

  //Reveals the cart
  showCart(){
    if (this.cartQtty==0)return;
    bus.$emit('showCart', this.cartQtty);
  },
  hider(e){
  if(e.target.id=='lines-clicker') return; //Makes the gategories menu disappear when you click outside of hamburger
  this.catReveal=false;
},
  id_passer(e){
   let passName =e.target.id; 
     this.catIndex = this.product_name.indexOf(passName); //Detects the index of category name for further use
    bus.$emit('passName', [passName, this.catIndex]);//Passes the category id (name of category for further use) and passes index of the name for further use
  }
},
created(){
  bus.$on('cartQtty', qtty=>this.cartQtty=qtty);
  bus.$on('prodEmit', categNam=>{ //Catches the array data sent from Products to extract the names and push it into the product_name array to be used in id_passer and in the v-for from the template in order to display the names extracted from the passed array
   this.categNam = categNam;
   let x;
  for (x in this.categNam){
   this.nam.push( JSON.stringify(this.categNam[x]));
   this.product_name.push(this.nam[x].split(`"`)[1]);
  }
  })
  bus.$on('query', qu=>{ //Catches the query that the user made by using the search feature to be used in order to reset the category index
  this.catIndex = this.product_name.indexOf(qu);
  bus.$emit('catIndex', this.catIndex);//Emits new category index (to simply put it this resets the category index by the user when they search and id_passer resets the category index when the user uses the category menu)
  })
}
}
</script>


<style lang="scss" scoped>

@mixin resize{
  @media screen and (min-width:600px){
    @content
  }
}

#header{
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #2c3e50;
  width: 100vw;
  .shop-cart{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .counter{
    color: whitesmoke;
    font-size: 20px;
    font-weight: bold;
    position: absolute;
   top: 5px;
  }
  img{
 width: 50px;
 height: 50px;
  }
  .fa-shopping-cart{
    font-size: 30px;
    color:  #f1c40f;
    cursor: pointer;
  
  }
  .fa-shopping-cart:hover{
    color:  #af8c00;
  }
  .container-categ{
    position: absolute;
    z-index: 99;
    top: 70px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
      .categories{
        background: #f1c40f;
        width: 0%;
        transition: 0.3s ease-in-out;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        position: relative;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;
        font-size: 20px;
        color: #2c3e50;
      .product_names{
        h4{
          cursor: pointer;
        }
        h4:hover{
          opacity: 0.8;
        }
      }
   }


    .reveal-categ{
      width: 100%;
      transition: 0.3s ease-in-out;
      pointer-events: auto;
    }
  }

  @include resize{
    .container-categ{
      width: 600px;
    }
  }
}
 @include resize{
    #header{
      width: 600px;
    }
  }
</style>