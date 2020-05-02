<template>
  <div >
  <div>
 <button @click="changer" >{{cart.add}}</button>
    </div>
  </div>
</template>
<script>
//Helps with passing data betwen child elements
import {bus} from '../main'


export default {
  name:'ToCart',
  data(){
    return{
      cart:{
        add:'Add to cart',
      },
      counter:0,
    }
  },
  methods:{
    changer(e){
      // e.target.accessKey=this.counter;
      console.log(e)
      // this.counter++;
      bus.$emit('prod-numb', e.composedPath()[3].id);//Passes the index of the product that was added to the cart
    },
  },
}
</script>

<style lang="scss" scoped>
  button{
    border:none;
    padding: 5px;
    color: #2c3e50;
    background:#f1c40f;
    font-weight: bold;
    width: 90px;
    transition: 0.3s ease-in-out;
  }
  button:hover{
    background: #2c3e50;
    color: #f1c40f;
    transition: 0.3s ease-in-out;
  }
</style>