<template>
<!-- Hides DOM data if cat (category variable is empty) -->
<div>
  <h2 v-if="notValid">{{notValid}}</h2>
<div id="products-cont" v-if="verifier" > 
    <div class="products-grid">
      <!-- Loops through images array to create the products that will be displayed in the DOM. The 'cat' variable is dictated by the 'passName' data emited by the Header component-->
          <div class="products" :key="img.id" v-for="(img, index) in images2[catIndex][cat]" >
            <!-- catIndex is dictated by the number emited by the Header component in order to set where the user is operating based on what category he selected or searched. The index below has the role to loop through each atribute of the products that are displayed to give each product its own name, description and price -->
            <!-- Binded images that resulted from the loop -->
            <div class="img-text">
               <img :src=img alt="">
               <!-- Text containing the products information -->
               <div class="text">
                 <!-- Name -->
               <h4>{{images2[catIndex]['Name'][index]}}</h4>
                  <!-- Description -->
               <p>{{images2[catIndex]['Desc'][index]}}</p>
                  <!-- Stock -->
                <h4>{{stock[index]}}</h4>
               </div>
            </div>
              <!-- The index is placed here as an id in order to help the data manipulation later on -->
              <!-- Contains the add to cart button and the price of each product -->
              <div :id="index" class="price-add">
                  <div class="add-cart">
                      <button :id="index" @click="changer">Add to cart</button>
                  </div>
                      <h4>${{images2[catIndex]['Price'][index]}}</h4>
                </div>
          </div>
    </div>
</div>
</div>
</template>


<script>
//Helps to pass data through child elements
import {bus} from '../main'

export default {
  name:'Products',
   data(){
    return{
      verifier:false,//Only displays the products if a valid input has been detected
      notValid:'',
      added:'',//Quantity added by user in the Cart element when pressing the update button
      remId:'',//Used on the 'remId' event to identify the position of the stock in the stock array belonging to the main data array called images.
      stock:[],//Empty array used to display the text representative of what is the curent stock of the displayed products
      cat:'', //Category selected by user
      catIndex:'',//Index of the category selected
      dataName:'',//Contains random names from a API fetch below
      dataDesc:'',//Contains random description from a API fetch below
      cartItems:[],//Contains the intems that will be added to the cart
      //Main array that contains the products

      //Went down this path for lack of a server from where I could have used a fetch API
      images:[
          {
            clothes:[require('../assets/jeans.png'),require('../assets/tshirt.png'),require('../assets/shirt.png'),require('../assets/skirt.png')],
            Name:['Jeans','T-Shirt', 'Shirt', 'Skirt'],
            Desc:['Lorem ipsum dolor sit amet, consectetur adipiscing elit..', 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Velit esse cillum dolore eu fugiat nulla pariatur.','Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia'],
            Price:[10.5, 5, 15,14],
            Stock:[100, 155, 23, 33]
          },
          {
            laptops:[require('../assets/assusrog.png'),require('../assets/hp.png'),require('../assets/dell.png'),require('../assets/predator.png')],
            Name:['Assus ROG Gaming Laptop', 'HP Laptop','Dell Laptop', 'Raptor Gaming Laptop'],
            Desc:['Sed ut perspiciatis unde omnis iste natus error sit voluptatem.','Quasi architecto beatae vitae dicta sunt explicabo.','Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.','Ut enim ad minima veniam, quis nostrum exercitationem.'],
            Price:[2000, 400, 195.5, 3000],
            Stock:[19, 2, 3, 15]
          },
          {
            tools:[require('../assets/toolskit.png'),require('../assets/toolskit2.png'),require('../assets/tools4.png'),require('../assets/toolskit3.png')],
            Name:['Tool box ALG_917-0797-GB', 'Proffesional tools kit','Tools bundle','Mini tool box ALG_917-0797-GB'],
            Desc:['Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quamt.','At vero eos et accusamus et iusto odio dignissimos ducimus qui.','Quas molestias excepturi sint occaecati cupiditate non provident.','Itaque earum rerum hic tenetur a sapiente delectus, ut aut.'],
            Price:[300,450.5,13,100],
            Stock:[3, 13, 23, 33]
          },
          {
            bikes:[require('../assets/bike1.png'),require('../assets/bike2.png'),require('../assets/bike3.png'),require('../assets/bike4.png')],
            Name:['Cortello Silver','Mint ANGLE-X2','DCFC-X2','SX466'],
            Desc:['Fuga eos qui dolor rerum inventore corporis exercitationem.','Vel quae voluptas qui exercitationem voluptatibus unde.','Nihil ut voluptates blanditiis autem odio dicta rerum quisquam.','Iste ut laborum aliquid velit facere itaque quo ut soluta dicta voluptate.'],
            Price:[300, 250, 399.99,550],
            Stock:[11, 4, 7, 23]
          },
          {
            deodorant:[require('../assets/axe2.png'),require('../assets/lynx.png'),require('../assets/axe.png'),require('../assets/dove.png')],
            Name:['AXE Green','Lynx','AXE','Fougère'],
            Desc:['Consequatur necessitatibus totam sed sit dolorum recusandae quae odio','Veritatis voluptates necessitatibus maiores corrupti neque et','Sdoloribus est illo sed minima aperiam ut dignissimos.','Cqui harum consequatur fugiat et eligendi perferendis.'],
            Price:[10,32,4.66,20],
            Stock:[20, 14, 0, 19]
          }
      ],
      images2:[],//Copy of main array
    }
  },
  methods:{
    //Responsible for updating the stocks
      stockHolder(){
        if(this.verifier==false)return;
      //Stock message holding array
      let stock =[];
       let stock_Array=this.images2[this.catIndex]['Stock'];
      //Loops through the product array "images2" to locate the "Stock" position and check the quanitity based on that it will update the DOM with the coresponding message
       for (let i = 0; i<this.images2[this.catIndex][this.cat].length;i++){
         if (stock_Array[i]>15){
            stock[i]='In stock'
            }else if(stock_Array[i]<=0){
              stock[i]='Out of stock'
            }else if (stock_Array[i] < 5 && stock_Array[i] !=0){
            stock[i] ='Limited stock'
             }else {
              stock[i]='In stock'
          }
        }
     this.stock=stock;//Transfers the stock holding array to the data array so it updates in the DOM.
      },
    //Creates an array containing a product based on what the user added to cart and gets sent to be added to the cart in the Cart component
    changer(e){
    let productId=e.target.id;
     if (this.images2[this.catIndex]['Stock'][productId]<=0){//If the stock of the product has hit 0 prevents the user from adding more through  the Add to cart option 
       return
     }else {
      this.images2[this.catIndex]['Stock'][productId]--;//If there is stock this decreases it every time the user adds to cart
     }
       //Product image
       this.cartItems.push(this.images2[this.catIndex][`${this.cat}`][productId]);
      //Product name
       this.cartItems.push(this.images2[this.catIndex]['Name'][productId]);  
       //Product description   
       this.cartItems.push(this.images2[this.catIndex]['Desc'][productId]);
       //Product price
       this.cartItems.push(this.images2[this.catIndex]['Price'][productId]);
       //Added for later used to keep track of how many of the same items are added in the cart
       this.cartItems.push(1);
      bus.$emit('cartItems', this.cartItems) //Emits the product data
       this.cartItems=[];//Empties the array so it works properly otherwise it's going to have duplicates
       this.stockHolder();
    },
  },
    created(){
   this.images2 =JSON.parse(JSON.stringify(this.images));//Clone of main array to be used for stock updates and to not alter the original
    bus.$emit('prodEmit', this.images2);//Emits the clone array to header so the category names can be extracted and used
     bus.$on('passName', nam=>{//nam contains a 2 element array with category id (name of category) and index of the name emited by Header, id_passer
      this.cat=nam[0] //Sets the category selected by the user in the category menu
      this.verifier=true;
      this.catIndex= nam[1]//Sets the category index 
      this.stockHolder();
      this.notValid='';//Removes not valid message
     });
      bus.$on('query', qu=>{//Case `search` by user
      let counter=0;
      //Checks category array based on user input and if no match is returned displays the  notValid message
        this.images2.forEach(nam=>{
          if (qu!=Object.keys(nam)[0]){
            counter++;
          if (counter==this.images2.length){
           this.verifier=false;
          this.notValid='This is a Shopping App Demo, please try searching the following cateogries: "Bikes, Clothes, Laptops, Deodorant or Tools"';
            } return;
          }
          this.cat=qu //Sets the category queried by the user in the category menu
          this.stockHolder();//Called to display the stock text for the products
          this.verifier=true;//If there is a match the products get displayed
          this.notValid='';
        });
     });
     bus.$on('catIndex', ind=>{
       this.catIndex= ind //Sets the category index 
      if (this.catIndex>=0)this.verifier=true;
     });
    
     //Handles the user input quantity that can be modified for each product in the cart
           bus.$on('qtty_add',qtty_add=>{
        let counter =-1;//Used for positioning in the images2 array(clone of the main array)
        this.images2.map(arr=>{
          counter++;//Increments untill match
          arr.Name.forEach(nam=>{
            if(qtty_add[1]==nam){//If match
              let id = arr.Name.indexOf(qtty_add[1]);//Sets the position of the stock based on the product that is being updated quantity wise 
              let added = parseInt(qtty_add[0]);//Quantity added by user
              this.images2[counter]['Stock'][id]=this.images[counter]['Stock'][id]//Resets to original stock value in case there's a copy or multiple copies of the product added in the cart by the Add to cart button
           this.images2[counter]['Stock'][id]=this.images2[counter]['Stock'][id]-added; //Decreases the new quantity from the reset stock
             this.stockHolder();
            }
          })
        })

      });
      //When the user interacts with the stock by removing the an item from the cart "remId trigers to send the stock position and updates it to its original quantity"
     bus.$on('remId', id=>{
       let counter =-1;
       this.images2.map(arr=>{
        counter++;
         arr.Name.forEach(nam=>{
           if (id[0] == nam){
           this.remId = arr.Name.indexOf(id[0])
            this.added=parseInt(id[1])
           if (this.catIndex>=0)this.verifier=true;
           this.images2[counter]['Stock'][this.remId] = this.images[counter]['Stock'][this.remId];
           this.stockHolder();
           }
         })
       })
     });
  } 
}
</script>

<style lang="scss" scoped>
// Style for the not valid message
h2{
  text-align:center;
  font-size:15px;
  color: #2c3e50;
}
#products-cont{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: #2c3e50;
}
.products-grid{
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px, 1fr));
  grid-gap: 5px;
  width: 95%;
.products{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 95%;
  .img-text{
    display: flex;
    padding-bottom: 40px;
    img{
    width: auto;
    height:60px;
    position: relative;
    right: 10px;
    margin-right: 5px;
    }

    @supports (-ms-ime-align:auto) {
      img {
        width: auto;
        height: 80px;
      }
  }

    @supports (-moz-appearance:none) {
      img {
         width: auto;
         height: 70px;
      }
    }
  }
  .price-add{
    width: 100%;
    height:98%;
    position: absolute;
    display: flex;
    align-items: flex-end;
   justify-content: flex-start;
 h4{
     margin-left: 10px;
 }
  }
  .add-cart{
    button{
    position: relative;
    border:none;
    padding: 5px;
    color: #2c3e50;
    background:#f1c40f;
    font-weight: bold;
    width: 90px;
    transition: 0.3s ease-in-out;
    }
  }
  button:hover{
    background: #2c3e50;
    color: #f1c40f;
    transition: 0.3s ease-in-out;
  }
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f1c40f;

 }
} 

</style>