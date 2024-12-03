let listProduct = document.querySelector('.listProduct')
let listCart = document.querySelector('.listCart')
let iconCart = document.querySelector('.icon-cart')
let iconCartSpan = document.querySelector('.icon-cart span')
let body = document.querySelector('body')
let closeCart = document.querySelector('.close')
let removeAll = document.querySelector('.removeall')
let totalCount = document.querySelector('.totalCount')
let products = []
let cart = []

document.addEventListener('selectstart',(e)=>{
  e.preventDefault()
})

iconCart.addEventListener('click',()=>{
  body.classList.toggle('showCart')
}) 
closeCart.addEventListener('click',()=>{
  body.classList.toggle('showCart')
})
removeAll.addEventListener('click',()=>{
  cart = []
  addCartToDOM()
  addCartToMemory()
})

  const addDataToDOM = () => {
    if(products.length>0){
      products.forEach(product => {
        let newProduct = document.createElement('div')
        newProduct.dataset.id = product.id
        newProduct.classList.add('item')
        newProduct.innerHTML = `
        <img src="${product.image}" alt="">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
        <button class="addCart">Add to cart</button>
        `
        listProduct.appendChild(newProduct)
      })
    }
  }

  listProduct.addEventListener('click',(e)=>{
    let clickTarget = e.target
    if(clickTarget.classList.contains('addCart')){
      let product_id = clickTarget.parentElement.dataset.id
      if (product_id) {
          addToCart(product_id)
      } else {
          console.error("無法獲取 product_id")
      }
    }
  })

  const addToCart = (product_id) => {
    let clickTargetInCart = cart.findIndex((value) => value.product_id == product_id)
    if(cart.length <= 0){
      cart = [{
        product_id: product_id,
        quantity: 1
      }]
    }else if(clickTargetInCart <0){
      cart.push({
        product_id: product_id,
        quantity: 1
      })
    }else{
      cart[clickTargetInCart].quantity += 1
    }
    addCartToDOM()
    addCartToMemory()
  }

  const addCartToMemory = ()=>{
    localStorage.setItem('cart',JSON.stringify(cart))
  }
  const addCartToDOM = ()=>{
    listCart.innerHTML = ''
    let totalQuantity = 0
    if(cart.length >0){
      cart.forEach(item => {
        totalQuantity += item.quantity
        let newItem = document.createElement('div')
        newItem.classList.add('item')
        newItem.dataset.id = item.product_id

        let positionProduct = products.findIndex((value) => value.id == item.product_id)
        let info = products[positionProduct]
        if (info) {
          newItem.innerHTML = `
              <div class="image">
                  <img src="${info.image}" alt="">
              </div>
              <div class="name">
                  ${info.name}
              </div>
              <div class="totalPrice">
                  $${info.price * item.quantity}
              </div>
              <div class="quantity">
                  <span class="minus">-</span>
                  <span>${item.quantity}</span>
                  <span class="plus">+</span>
              </div>
          `;
            listCart.appendChild(newItem)
        } else {
            console.error(`找不到 product_id 為 ${item.product_id} 的商品`)
        }
      })
    }
    iconCartSpan.innerText = totalQuantity
    totalCount.innerText = `Count: ${totalQuantity} / Total: $${cart.reduce((total, item) => {
      let product = products.find(p => p.id == item.product_id)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)}`
  }

  listCart.addEventListener('click',(e)=>{
    let clickTarget = e.target
    if(clickTarget.classList.contains('minus') || clickTarget.classList.contains('plus')){
      let product_id = clickTarget.parentElement.parentElement.dataset.id
      let type = clickTarget.classList.contains('plus') ? 'plus' : 'minus'
      changeQuantity(product_id, type)
    }
  })
const changeQuantity = (product_id,type)=>{
  let positionItemInCart = cart.findIndex((value)=> value.product_id == product_id)
  if(positionItemInCart >= 0){
    switch(type){
      case 'plus':
        cart[positionItemInCart].quantity += 1
        break
      default:
        let valueChange =cart[positionItemInCart].quantity -1
        if(valueChange > 0){
          cart[positionItemInCart].quantity = valueChange
        }else{
          cart.splice(positionItemInCart,1)
        }
        break
    }
  }
  addCartToDOM()
  addCartToMemory()
}
const initApp = () => {
  fetch('products.json')
  .then(response => response.json())
  .then(data=>{
    products = data
    addDataToDOM()

    if(localStorage.getItem('cart')){
      cart = JSON.parse(localStorage.getItem('cart'))
      addCartToDOM()
    }
  })
}

initApp()