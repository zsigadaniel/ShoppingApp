<template>
<!-- Hides DOM data if cat (category variable is empty) -->
<div>
  <h2 v-if="notValid">{{notValid}}</h2>
<div id="products-cont" v-if="verifier" > 
    <div class="products-grid">
      <!-- Loops through images array to create the products that will be displayed in the DOM. The 'cat' variable is dictated by the 'passName' data emited by the Header component-->
          <div class="products" :key="img.id" v-for="(img, index) in images2[catIndex][cat]" >
            <!-- Binded images that resulted from the loop -->
              <img :src=img alt="">
              <!-- The index is placed here as an id in order to help the data manipulation later on -->
              <div :id="index" class="products-text">
                <!-- catIndex is dictated by the number emited by the Header component in order to set where the user is operating based on what category he selected or searched. The index below has the role to loop through each atribute of the products that are displayed to give each product its own name, description and price -->
                  <h4>{{images2[catIndex]['Name'][index]}}</h4>
                  <p>{{images2[catIndex]['Desc'][index]}}</p>
                  <h4>{{images2[catIndex]['Price'][index]}}</h4>
                  <h4>{{stock[index]}}</h4>
                  <!-- Ads the buttons that permit the user to add products to the cart -->
              </div>
                <div class="add-cart">
                  <button :id="index" @click="changer">Add to cart</button>
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
      verifier:false,
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
      images:[
          {
            clothes:['https://cdn-images.farfetch-contents.com/ami-paris-carrot-fit-jeans_14240703_20959980_1000.jpg?c=2','https://de9luwq5d40h2.cloudfront.net/catalog/product/zoom_image/69_41435100029.jpg','https://contents.mediadecathlon.com/p1484240/k$ab565f3675dbdd7e3c486175e2c16583/men-s-trekking-shirt-travel100-warm-burgundy.jpg?&f=800x800','https://cdn11.bigcommerce.com/s-v9ta8cea70/images/stencil/1280x1280/products/1701/3960/BK-1602A__96034.1554043700.jpg?c=2'
            ],
            Name:['Jeans','T-Shirt', 'Shirt', 'Skirt'],//Both empty arrays are filed by a data handler below
            Desc:['A pair of blue jeans that increase charisma by 20', 'A T-shirt that adds 10 points of armor', 'Shirt that makes the wearer move 30% faster at night','Grants user ability to fly for 10 minutes'],
            Price:[10.5+'$', 5+'$', 15+'$',14+'$'],
            Stock:[100, 155, 23, 33]
          },
          {
            laptops:['https://s12emagst.akamaized.net/products/28630/28629587/images/res_7cd24eeb1f76750d3bb9088004bf31a3_450x450_e3jg.jpg','https://media.4rgos.it/i/Argos/9164291_R_Z001A?w=750&h=440&qlt=70','https://images.idgesg.net/images/article/2019/07/aspire5slim-100806682-large.jpg','https://c1.neweggimages.com/ProductImage/34-235-011-V21.jpg'
            ],
            Name:['ROG gaming laptop', 'Netflix laptop','Buget laptop', 'ROG gaming laptop mark II'],
            Desc:['Assassin`s Creed Odyssey at 60 fps (sometimes 49)','For Netflix and chill (heard The Witcher series is pretty good)','Sorry but this is all you can afford','Minecraft with Ray tracing and 2k texture pack at 30fps...#stableFrameRate'],
            Price:[2000+'$', 400+'$', 195.5+'$',3000+'$'],
            Stock:[19, 2, 3, 15]
          },
          {
            tools:['https://www.kstools.com/media/image/76/fe/6b/FOT_GES_ALG_917-0797-GB_SALL_AING_V15c91d4e3dd32e_600x600@2x.jpg','https://5.imimg.com/data5/BA/SG/MY-2771418/hand-tools-500x500.png','https://itslondon.s3.amazonaws.com/p/xl/OXP4PHTPACK.jpg','https://images-na.ssl-images-amazon.com/images/I/51UDxZiACqL._AC_SY400_.jpg'
            ],
            Name:['Tool box ALG_917-0797-GB', 'Pliers','Tool bundle','Mini tool box ALG_917-0797-GB'],
            Desc:['For doing work even if you don`t have work to do','Intended for working people not to be used for interogation','Starter kit, go on little one','For doing work but only when you have to'],
            Price:[300+'$', 15.5+'$', 13+'$',100+'$'],
            Stock:[3, 13, 23, 33]
          },
          {
            bikes:['https://cdn.shopify.com/s/files/1/2081/1519/products/1600x1067_Cortello_Silver_PROFILE_1_1.jpg?v=1573931871','https://cdn.shopify.com/s/files/1/2081/1519/products/1600x1067_US_B_Mint_ANGLE-X2.jpg?v=1573931859','https://cdn.shopify.com/s/files/1/2081/1519/products/1600x1067_DCFC-X2.jpg?v=1545814341','https://images-na.ssl-images-amazon.com/images/I/815OuNAxtwL._SX466_.jpg'
            ],
            Name:['Cortello Silver','Mint ANGLE-X2','DCFC-X2','SX466'],
            Desc:['Enjoy the wind with this decent priced bike','In case you like the color','Great bike, and great if you fear the number 4','If you can`t afford a monster truck get this'],
            Price:[300+'$', 250+'$', 399.99+'$',550+'$'],
            Stock:[11, 4, 7, 23]
          },
          {
            deodorant:['https://images.freshop.com/00079400379979/885da018da1ac07f3657036390148f35_large.png','https://cdn.fragrancenet.com/images/photos/900x900/275504.jpg','https://images.freshop.com/00079400551405/72ea1b88f804a07c817fa736c45398c7_large.png','https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/8/9/8901450007286.jpg'
            ],
            Name:['AXE','Calvin Klein','AXE KILO','DENVER'],
            Desc:['You a question? body spray','Great dude, likes spray apparently','Same question only green','Classy looking spray, great color choice'],
            Price:[10+'$', 5+'$', 4.66+'$',20+'$'],
            Stock:[20, 14, 0, 19]
          }
      ],
      images2:[],
    }
  },
  methods:{
    // textFetcher(){
    //   fetch('https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/comments?_limit=20')
    //   .then(res=>{
    //     return res.json();
    //   }).then(this.setResults); //Data fetch to use as names and description
    // },
    //       setResults(results){ //Data handler
    //       this.dataName = results.map(dat=>dat.name); //Sets the random names
    //       this.dataDesc = results.map(dade=>dade.body); //Sets the random descriptions
    //       for (let i=0; i < this.images2.length; i++){//Loops and silces the name and description array of 20 items to distribute them in each of their respective arrays
    //       this.images2[i]['Desc'] = this.dataDesc.slice(i*4, (i+1)*4);
    //       this.images2[i]['Name'] = this.dataName.slice(i*4, (i+1)*4);
    //       }
    //   },

    //Responsible for updating the stocks
      stockHolder(){
        //Stock message holding array
        if(this.verifier==false)return;
      let stock =[];
       let stock_Array=this.images2[this.catIndex]['Stock'];
      //Loops through the product containing array "images" to locate the "Stock" position and check the quanitity based on that it will update the DOM with the coresponding message
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
     this.stock=stock;//Transfers the stock holding array to the data array for update in the DOM.
      },
    changer(e){
    let productId=e.target.id//Checks the id of the button to relate it to the product that the user ads to the cart
//Creates an array containing a product based on what the user added to cart and gets sent to be added to the cart in the Cart component
     if (this.images2[this.catIndex]['Stock'][productId]<=0){//If the stock of the product has hit 0 prevents the user from adding more through  the Add to cart option 
       return
     }else {
      this.images2[this.catIndex]['Stock'][productId]--;//If there is stock this decreases it every time the user presses Add to cart
     }
       //Product image
       this.cartItems.push(this.images2[this.catIndex][`${this.cat}`][productId]);
      //Product name
       this.cartItems.push(this.images2[this.catIndex]['Name'][productId]);  
       //Product description   
       this.cartItems.push(this.images2[this.catIndex]['Desc'][productId]);
       //Product price
       this.cartItems.push(this.images2[this.catIndex]['Price'][productId]);
       //Used to be able to show how many items are in the cart
       this.cartItems.push(1);
      bus.$emit('cartItems', this.cartItems) //Emits the product data
       this.cartItems=[];//Empties the array so it works properly otherwise it's going to have duplicates
       this.stockHolder();
    },
  },
    created(){
   this.images2 =JSON.parse(JSON.stringify(this.images));//Clone of main array to be used for stock updates and to not alter the original
    bus.$emit('prodEmit', this.images2);//Emits the clone array to header so the category names can be extracted and used
     bus.$on('passName', nam=>{
      this.cat=nam[0] //Sets the category selected by the user in the category menu
      this.verifier=true;
      this.catIndex= nam[1]
      this.stockHolder();
      this.notValid='';
     });
      bus.$on('query', qu=>{//Case query by user
      let counter=0;
        this.images2.forEach(nam=>{
          if (qu!=Object.keys(nam)[0]){
            counter++;
          if (counter==this.images2.length){
             this.verifier=false;
          this.notValid='This is a Shopping App Demo, please try searching the following products: "Bikes, Clothes, Laptops, Deodorant or Tools"';
            } return;
          }
          this.cat=qu //Sets the category queried by the user in the category menu
          this.stockHolder();//Called to display the stock text for the products
          this.verifier=true;
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
@mixin resize{
  @media screen and (min-width:600px){
    @content
  }
}
h2{
  text-align:center;
  font-size:15px;
  color: #2c3e50;
}
#products-cont{
  display: flex;
  justify-content: center;
  color: #2c3e50;
}
.products-grid{
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(200px, 1fr));
  grid-gap: 5px;
  width: 100%;
.products{
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .products-text{
    padding-bottom: 20px;
  }
     button{
    border:none;
    padding: 5px;
    color: #2c3e50;
    background:#f1c40f;
    font-weight: bold;
    width: 90px;
    transition: 0.3s ease-in-out;
    }
  .add-cart{
    width: 100%;
    height:100%;
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
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

  @supports (-ms-ime-align:auto) {
      img {
          width: 13vw;
      }
  }
  @include resize{
     @supports (-ms-ime-align:auto) {
      img {
          width: 80px;
      }
  }
  }
  @supports (-moz-appearance:none) {
      img {
        width: 500px;
      }
  }
 }
} 

</style>