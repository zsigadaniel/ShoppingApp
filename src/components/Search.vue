<template>
  <div class="container">
    <!-- Catches what the user searched for and initiates the query function -->
    <input type="search" id="search" placeholder="Search..." v-model="search" 
    @keypress="query">
  </div>
</template>

<script>
//Helps with passing data betwen child elements
import {bus} from '../main'

export default {
  name:'Search',
  data(){
    return{
      search:'',//Contains what the user queried
    }
  },
  methods:{
    query(e){
      if (e.key != 'Enter') return //Makes sure the keypress was enter
      bus.$emit('query', this.search.toLowerCase()); //Emits what the user searched so it can be used in the Header component
      this.search ='';//Empties the search query
    }
  }
}
</script>


<style lang="scss" scoped>
.container{
   display: flex;
  justify-content: center;
  #search{
  border: 1.5px solid #f1c40f;
  padding: 7px;
  margin-top: 10px;
}
#search::placeholder{
  color:  #2c3e50;
}
}


</style>