// 스토어
import { store } from './store';

// utils
import {
  getDiscountTotal,
  triggerFlashSale,
  triggerRecommendSale,
} from './utils';

// config
import { PRODUCT_DISCOUNT_RATE } from './config';

export const main = () => {
  const $root = document.getElementById('app');

  const $container = document.createElement('div');
  $container.className = 'bg-gray-100 p-8';

  const $wrapper = document.createElement('div');
  $wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const $heading = document.createElement('h1');
  $heading.className = 'text-2xl font-bold mb-4';
  $heading.textContent = '장바구니';

  const cartProductList = document.createElement('div');
  cartProductList.id = 'cart-items';

  const cartTotalText = document.createElement('div');
  cartTotalText.id = 'cart-total';
  cartTotalText.className = 'text-xl font-bold my-4';

  const productSelectBox = document.createElement('select');
  productSelectBox.id = 'product-select';
  productSelectBox.className = 'border rounded p-2 mr-2';

  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addButton.textContent = '추가';

  const stockInformationText = document.createElement('div');
  stockInformationText.id = 'stock-status';
  stockInformationText.className = 'text-sm text-gray-500 mt-2';

  $wrapper.appendChild($heading);
  $wrapper.appendChild(cartProductList);
  $wrapper.appendChild(cartTotalText);
  $wrapper.appendChild(productSelectBox);
  $wrapper.appendChild(addButton);
  $wrapper.appendChild(stockInformationText);
  $container.appendChild($wrapper);
  $root.appendChild($container);

  setTimeout(() => {
    setInterval(() => {
      const { products } = store.getState();
      const updatedCartProducts = triggerFlashSale(products);
      if (updatedCartProducts) {
        store.setState({ products: updatedCartProducts });
        renderProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      const { products, lastSelectedProductId } = store.getState();
      const updatedCartProducts = triggerRecommendSale(
        products,
        lastSelectedProductId
      );
      if (updatedCartProducts) {
        store.setState({ products: updatedCartProducts });
        renderProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  store.subscribe(render);
  render();
  renderProductSelectOptions();
};

const calculateCartTotal = (cartProducts) => {
  let totalQuantity = 0;
  let totalAmountBeforeDiscount = 0;
  let totalAmount = 0;

  cartProducts.forEach((product) => {
    const quantity = product.quantity;
    const totalAmountItem = product.price * quantity;

    totalQuantity += quantity;
    totalAmountBeforeDiscount += totalAmountItem;

    if (quantity < 10) {
      totalAmount += totalAmountItem;
      return;
    }

    totalAmount += totalAmountItem * (1 - PRODUCT_DISCOUNT_RATE[product.id]);
  });

  const { discountRate, discountedPrice } = getDiscountTotal(
    totalQuantity,
    totalAmount,
    totalAmountBeforeDiscount
  );

  const bonusPoints = Math.floor(discountedPrice / 1000);

  return {
    totalQuantity,
    totalAmountBeforeDiscount,
    totalAmount: discountedPrice,
    discountRate,
    bonusPoints,
  };
};

const render = () => {
  const { cartProducts, totalAmount, bonusPoints, discountRate } =
    store.getState();

  renderCartProductList(cartProducts);
  renderTotalAmount(totalAmount);
  renderBonusPoints(bonusPoints);
  renderDiscountRate(discountRate);
  renderStockInformationText();
};

const renderCartProductList = (updatedCartProducts) => {
  const cartProductList = document.getElementById('cart-items');
  const cartProductListChildren = Array.from(cartProductList.children);

  const productRemoveCart = cartProductListChildren.filter(
    (child) => !updatedCartProducts.some((item) => item.id === child.id)
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

const renderProductSelectOptions = () => {
  const { products } = store.getState();
  const productSelectBox = document.getElementById('product-select');
  productSelectBox.innerHTML = '';
  products.forEach((product) => {
    const option = ProductSelectOption(product);
    productSelectBox.appendChild(option);
  });
};

const renderTotalAmount = (totalAmount) => {
  const cartTotalText = document.getElementById('cart-total');
  cartTotalText.textContent = `총액: ${Math.round(totalAmount)}원`;
};

const renderDiscountRate = (discountRate) => {
  const cartTotalText = document.getElementById('cart-total');

  if (discountRate > 0) {
    const discountRateText = document.createElement('span');

    discountRateText.classList.add('text-green-500', 'ml-2');
    discountRateText.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    cartTotalText.appendChild(discountRateText);
  }
};

const renderBonusPoints = (bonusPoints) => {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    const cartTotalText = document.getElementById('cart-total');
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    cartTotalText.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${bonusPoints})`;
};

const renderStockInformationText = () => {
  const { products } = store.getState();
  let informationMessage = '';

  products.forEach(
    (product) => (informationMessage += StockInformation(product))
  );

  const stockInformationText = document.getElementById('stock-status');
  stockInformationText.textContent = informationMessage;
};

main();

const hasCartProductById = (id) => {
  const { cartProducts } = store.getState();
  return cartProducts.some((product) => product.id === id);
};

const deleteCartItem = (targetProduct) => {
  const { products, cartProducts } = store.getState();
  const newTotal = calculateCartTotal(
    cartProducts.filter((product) => product.id !== targetProduct.id)
  );
  store.setState({
    products: products.map((product) =>
      product.id === targetProduct.id
        ? { ...product, quantity: product.quantity + targetProduct.quantity }
        : product
    ),
    cartProducts: cartProducts.filter(
      (product) => product.id !== targetProduct.id
    ),
    ...newTotal,
  });
};

const addCart = (targetProduct, quantityChange) => {
  const { products, cartProducts } = store.getState();
  const product = products.find((product) => product.id === targetProduct.id);
  if (!product || (quantityChange > 0 && product.quantity < 1)) {
    alert('재고가 부족합니다.');
    return;
  }

  const newTotal = calculateCartTotal([
    ...cartProducts.map((product) =>
      product.id === targetProduct.id
        ? { ...product, quantity: product.quantity + quantityChange }
        : product
    ),
  ]);
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
    ...newTotal,
  });
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
    const newTotal = calculateCartTotal([
      ...cartProducts,
      { ...selectedProduct, quantity: 1 },
    ]);
    store.setState({
      products: products.map((product) =>
        product.id === selectedProductId
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ),
      cartProducts: [...cartProducts, { ...selectedProduct, quantity: 1 }],
      lastSelectedProductId: selectedProductId,
      ...newTotal,
    });
    return;
  }

  const newTotal = calculateCartTotal([
    ...cartProducts.map((product) =>
      product.id === selectedProductId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    ),
  ]);
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
    ...newTotal,
  });
};

const handleCartItemClick = (event) => {
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
};

const addButton = document.getElementById('add-to-cart');
addButton.addEventListener('click', handleAddCart);

const cartProductList = document.getElementById('cart-items');
cartProductList.addEventListener('click', handleCartItemClick);

// components
function ProductSelectOption({ id, name, price, quantity }) {
  const selectOption = document.createElement('option');
  selectOption.value = id;
  selectOption.textContent = `${name} - ${price}원`;

  if (quantity === 0) selectOption.disabled = true;

  return selectOption;
}

function StockInformation({ name, quantity }) {
  if (quantity >= 5) {
    return '';
  }

  if (quantity > 0) {
    return `${name}: 재고 부족 (${quantity}개 남음) `;
  }

  return `${name}: 품절 `;
}

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
