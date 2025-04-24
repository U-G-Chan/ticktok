<template>
  <div class="side-menu-nav">
    <div class="menu-icon">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped>
.side-menu-nav {
  padding: 5px;
  cursor: pointer;
}

.menu-icon {
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: #fff;
  border-radius: 2px;
}
</style> 