<template>
  <div id="hamburger">
    <div class="lines">
      
    </div>
     <!-- Emits an event when the user presses the hamburger menu that trigers the function that reveals the category menu -->
    <div id="lines-clicker" @click="$emit('reveal-cat')"></div> 
  </div>
</template>

<script>


export default {
  name:'Hamburger',

}
</script>

<style lang="scss" scoped>
#hamburger{
  width:30px;
  height:20px;
  .lines{
    border-bottom: 2px solid #f1c40f;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .lines::before{
    content: '';
    border-bottom: inherit;
    width: inherit;
    position: absolute;
    top:50%;
  }
    .lines::after{
    content: '';
    border-bottom: inherit;
    width: inherit;
    position: absolute;
  }
  #lines-clicker{
    width: 100%;
    height: 100%;
    position: relative;
    top: -100%;
    cursor: pointer;
  }
}
#hamburger:hover .lines::before{
      transition: 0.3s ease-in-out;
      transform: rotate(180deg);
  }
</style>