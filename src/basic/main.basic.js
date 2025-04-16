// 스토어
import { store } from './store';

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

const renderCartProductList = (updatedCartProducts) => {
  const cartProductList = document.getElementById('cart-items');
  const cartProductListChildren = Array.from(cartProductList.children);

  const productRemoveCart = cartProductListChildren.filter(
    (child) => !updatedCartProducts.some((product) => product.id === child.id)
  );

  for (const product of productRemoveCart) {
    cartProductList.removeChild(product);
  }

  for (const product of updatedCartProducts) {
    const productIndex = cartProductListChildren.findIndex(
      (child) => child.id === product.id
    );

    if (productIndex === -1) {
      cartProductList.appendChild(CartItem(product));
      return;
    }

    cartProductListChildren[productIndex].querySelector('span').textContent =
      `${product.name} - ${product.price}원 x ${product.quantity}`;
  }
};

function main() {
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

  store.subscribe(render);
}

const render = () => {
  const { cartProducts } = store.getState();

  renderCartProductList(cartProducts);
  renderStockInformationText();
  renderBonusPoints();
};

function renderProductSelectOptions() {
  const { products } = store.getState();
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
  const { cartProducts } = store.getState();
  totalAmount = 0;
  cartProductsCount = 0;

  var subTotal = 0;

  cartProducts.forEach((product) => {
    subTotal += product.price * product.quantity;
    cartProductsCount += product.quantity;

    var discount = 0;
    if (product.quantity >= 10) {
      if (product.id === 'p1') discount = 0.1;
      else if (product.id === 'p2') discount = 0.15;
      else if (product.id === 'p3') discount = 0.2;
      else if (product.id === 'p4') discount = 0.05;
      else if (product.id === 'p5') discount = 0.25;
    }

    totalAmount += product.price * product.quantity * (1 - discount);
  });

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
  const { products } = store.getState();

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

function CartItem({ id, name, price, quantity }) {
  const item = document.createElement('div');
  item.id = id;
  item.className = 'flex justify-between items-center mb-2';
  item.innerHTML = `
    <span>${name} - ${price}원 x ${quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
    </div>
  `;

  return item;
}

const hasCartProductById = (id) => {
  const { cartProducts } = store.getState();
  return cartProducts.some((product) => product.id === id);
};

const handleAddCart = () => {
  const { products, cartProducts } = store.getState();

  const productSelectBox = document.getElementById('product-select');
  const selectedProductId = productSelectBox.value;
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  if (!selectedProduct || selectedProduct.quantity <= 0) {
    alert('재고가 부족합니다.');
    return;
  }

  if (selectedProduct.quantity > 0 && !hasCartProductById(selectedProductId)) {
    store.setState({
      products: products.map((product) =>
        product.id === selectedProductId
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ),
      cartProducts: [...cartProducts, { ...selectedProduct, quantity: 1 }],
      lastSelectedProduct: selectedProductId,
    });

    calculateCartTotal();
    return;
  }

  store.setState({
    products: products.map((product) =>
      product.id === selectedProductId
        ? { ...product, quantity: product.quantity - 1 }
        : product
    ),
    cartProducts: cartProducts.map((product) =>
      product.id === selectedProductId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    ),
    lastSelectedProduct: selectedProductId,
  });

  calculateCartTotal();
};

const deleteCartItem = (targetProduct) => {
  const { products, cartProducts } = store.getState();
  store.setState({
    products: products.map((product) =>
      product.id === targetProduct.id
        ? { ...product, quantity: product.quantity + targetProduct.quantity }
        : product
    ),
    cartProducts: cartProducts.filter(
      (product) => product.id !== targetProduct.id
    ),
  });
  calculateCartTotal();
};

const addCart = (targetProduct, quantityChange) => {
  const { products, cartProducts } = store.getState();
  const product = products.find((product) => product.id === targetProduct.id);
  if (!product || (quantityChange > 0 && product.quantity < 1)) {
    alert('재고가 부족합니다.');
    return;
  }

  store.setState({
    products: products.map((product) =>
      product.id === targetProduct.id
        ? { ...product, quantity: product.quantity + quantityChange * -1 }
        : product
    ),
    cartProducts: cartProducts.map((product) =>
      product.id === targetProduct.id
        ? { ...product, quantity: product.quantity + quantityChange }
        : product
    ),
  });
  calculateCartTotal();
};

addButton.addEventListener('click', handleAddCart);

cartProductList.addEventListener('click', function (event) {
  const { cartProducts } = store.getState();
  var target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    var productId = target.dataset.productId;
    var cartProductItem = cartProducts.find(
      (product) => product.id === productId
    );

    if (target.classList.contains('quantity-change')) {
      var quantityChange = parseInt(target.dataset.change);
      addCart(cartProductItem, quantityChange);
    } else if (target.classList.contains('remove-item')) {
      deleteCartItem(cartProductItem);
    }
  }
});
