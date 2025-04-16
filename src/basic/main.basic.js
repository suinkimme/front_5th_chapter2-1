var products,
  productSelectBox,
  addButton,
  cartProductList,
  cartTotalText,
  stockInformationText;

var lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  cartProductsCount = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  const $root = document.getElementById('app');

  const $container = document.createElement('div');
  $container.className = 'bg-gray-100 p-8';

  const $wrapper = document.createElement('div');
  $wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  let $heading = document.createElement('h1');
  $heading.className = 'text-2xl font-bold mb-4';
  $heading.textContent = '장바구니';

  cartProductList = document.createElement('div');
  cartProductList.id = 'cart-items';

  cartTotalText = document.createElement('div');
  cartTotalText.id = 'cart-total';
  cartTotalText.className = 'text-xl font-bold my-4';

  productSelectBox = document.createElement('select');
  productSelectBox.id = 'product-select';
  productSelectBox.className = 'border rounded p-2 mr-2';

  addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addButton.textContent = '추가';

  stockInformationText = document.createElement('div');
  stockInformationText.id = 'stock-status';
  stockInformationText.className = 'text-sm text-gray-500 mt-2';

  renderProductSelectOptions();
  $wrapper.appendChild($heading);
  $wrapper.appendChild(cartProductList);
  $wrapper.appendChild(cartTotalText);
  $wrapper.appendChild(productSelectBox);
  $wrapper.appendChild(addButton);
  $wrapper.appendChild(stockInformationText);
  $container.appendChild($wrapper);
  $root.appendChild($container);
  calculateCartTotal();
  // setTimeout(function () {
  //   setInterval(function () {
  //     var luckyItem = products[Math.floor(Math.random() * products.length)];
  //     if (Math.random() < 0.3 && luckyItem.quantity > 0) {
  //       luckyItem.price = Math.round(luckyItem.price * 0.8);
  //       alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
  //       renderProductSelectOptions();
  //     }
  //   }, 30000);
  // }, Math.random() * 10000);
  // setTimeout(function () {
  //   setInterval(function () {
  //     if (lastSelectedProduct) {
  //       var suggest = products.find(function (item) {
  //         return item.id !== lastSelectedProduct && item.quantity > 0;
  //       });
  //       if (suggest) {
  //         alert(
  //           suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
  //         );
  //         suggest.price = Math.round(suggest.price * 0.95);
  //         renderProductSelectOptions();
  //       }
  //     }
  //   }, 60000);
  // }, Math.random() * 20000);
}

function renderProductSelectOptions() {
  productSelectBox.innerHTML = '';
  products.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    productSelectBox.appendChild(option);
  });
}

function calculateCartTotal() {
  totalAmount = 0;
  cartProductsCount = 0;

  var cartProducts = cartProductList.children;
  var subTotal = 0;

  for (var i = 0; i < cartProducts.length; i++) {
    (function () {
      var currentProduct;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === cartProducts[i].id) {
          currentProduct = products[j];
          break;
        }
      }

      var quantity = parseInt(
        cartProducts[i].querySelector('span').textContent.split('x ')[1]
      );

      var itemTotal = currentProduct.price * quantity;
      var discount = 0;

      cartProductsCount += quantity;
      subTotal += itemTotal;

      if (quantity >= 10) {
        if (currentProduct.id === 'p1') discount = 0.1;
        else if (currentProduct.id === 'p2') discount = 0.15;
        else if (currentProduct.id === 'p3') discount = 0.2;
        else if (currentProduct.id === 'p4') discount = 0.05;
        else if (currentProduct.id === 'p5') discount = 0.25;
      }

      totalAmount += itemTotal * (1 - discount);
    })();
  }

  let discountRate = 0;

  if (cartProductsCount >= 30) {
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  cartTotalText.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalText.appendChild(span);
  }

  renderStockInformationText();
  renderBonusPoints();
}

const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  var pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    cartTotalText.appendChild(pointsTag);
  }

  pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function renderStockInformationText() {
  var informationMessage = '';
  products.forEach(function (item) {
    if (item.quantity < 5) {
      informationMessage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });

  stockInformationText.textContent = informationMessage;
}

main();

addButton.addEventListener('click', function () {
  var selectedOption = productSelectBox.value;
  var selectedProduct = products.find(function (p) {
    return p.id === selectedOption;
  });

  if (selectedProduct && selectedProduct.quantity > 0) {
    var item = document.getElementById(selectedProduct.id);
    if (item) {
      var newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQuantity <= selectedProduct.q) {
        item.querySelector('span').textContent =
          selectedProduct.name +
          ' - ' +
          selectedProduct.price +
          '원 x ' +
          newQuantity;
        selectedProduct.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newCartProduct = document.createElement('div');
      newCartProduct.id = selectedProduct.id;
      newCartProduct.className = 'flex justify-between items-center mb-2';
      newCartProduct.innerHTML =
        '<span>' +
        selectedProduct.name +
        ' - ' +
        selectedProduct.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedProduct.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        selectedProduct.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        selectedProduct.id +
        '">삭제</button></div>';
      cartProductList.appendChild(newCartProduct);
      selectedProduct.q--;
    }

    calculateCartTotal();
    lastSelectedProduct = selectedProduct;
  }
});
cartProductList.addEventListener('click', function (event) {
  var target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    var productId = target.dataset.productId;
    var cartProductItem = document.getElementById(productId);
    var product = products.find(function (p) {
      return p.id === productId;
    });

    if (target.classList.contains('quantity-change')) {
      var quantityChange = parseInt(target.dataset.change);
      var newQuantity =
        parseInt(
          cartProductItem.querySelector('span').textContent.split('x ')[1]
        ) + quantityChange;
      if (
        newQuantity > 0 &&
        newQuantity <=
          product.quantity +
            parseInt(
              cartProductItem.querySelector('span').textContent.split('x ')[1]
            )
      ) {
        cartProductItem.querySelector('span').textContent =
          cartProductItem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        cartProductItem.remove();
        product.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      var removeQuantity = parseInt(
        cartProductItem.querySelector('span').textContent.split('x ')[1]
      );
      product.quantity += removeQuantity;
      cartProductItem.remove();
    }

    calculateCartTotal();
  }
});
