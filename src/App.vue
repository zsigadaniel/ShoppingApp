<template>
  <div id="app">
    <div class="container">
 <Header/>
 <Search/>
 <Products/>
 <Cart/>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import Search from './components/Search'
import Products from './components/Products'
import Cart from './components/Cart'

export default {
  name: 'App',
  components: {
    Header,
    Search,
    Products,
    Cart,
  },
}
</script>

<style lang='scss'>

@mixin resize{
  @media screen and (min-width:600px){
    @content
  }
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app{
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  button{
    cursor: pointer;
  }
}
@include resize{
.container{
  width: 600px;
}
}
</style>
