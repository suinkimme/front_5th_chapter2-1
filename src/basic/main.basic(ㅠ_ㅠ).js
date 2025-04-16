// store
import { store } from './store';

// utils
import { isOutOfStock, findProductById, hasCartProductById } from './utils';

// services
import { firstAddCart, addCart, removeCart } from './services/product';

// components
import {
  AddToCartButton,
  CartContainer,
  CartHeader,
  CartProductList,
  CartTotal,
  ProductSelector,
  StockStatus,
} from './components';

function main() {
  function render() {
    const $root = document.getElementById('app');
    $root.innerHTML = CartContainer({
      children: /* HTML */ `
        <div
          class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
        >
          ${[
            CartHeader({ text: '장바구니' }),
            CartProductList(),
            CartTotal(),
            ProductSelector(),
            AddToCartButton({ text: '추가' }),
            StockStatus(),
          ].join('\n')}
        </div>
      `,
    });
  }

  function handleAddCart() {
    const { selectedProductId } = store.getState();

    const selectedProduct = findProductById(selectedProductId);

    if (!isOutOfStock(selectedProduct)) {
      alert('재고가 부족합니다.');
      return;
    }

    if (!hasCartProductById(selectedProductId)) {
      firstAddCart(selectedProduct);
      return;
    }

    addCart(selectedProductId);
  }

  function handleSelectProduct(targetId) {
    const selected = findProductById(targetId);
    store.setState({ selectedProductId: selected.id });
  }

  function handleClick(event) {
    const targetAddButton = event.target.closest('#add-to-cart');

    if (targetAddButton) {
      handleAddCart();
    }
  }

  function handleChange(event) {
    const targetProdcutSelect = event.target.closest('#product-select');

    if (targetProdcutSelect) {
      handleSelectProduct(event.target.value);
    }
  }

  function init() {
    store.subscribe(render);

    document.body.addEventListener('click', handleClick);
    document.body.addEventListener('change', handleChange);

    render();
  }

  init();

  // updateSelOpts();
  // calcCart();
  // setTimeout(function () {
  //   setInterval(function () {
  //     var luckyItem = products[Math.floor(Math.random() * products.length)];
  //     if (Math.random() < 0.3 && luckyItem.q > 0) {
  //       luckyItem.val = Math.round(luckyItem.val * 0.8);
  //       alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
  //       updateSelOpts();
  //     }
  //   }, 30000);
  // }, Math.random() * 10000);
  // setTimeout(function () {
  //   setInterval(function () {
  //     if (lastSel) {
  //       var suggest = products.find(function (item) {
  //         return item.id !== lastSel && item.q > 0;
  //       });
  //       if (suggest) {
  //         alert(
  //           suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
  //         );
  //         suggest.val = Math.round(suggest.val * 0.95);
  //         updateSelOpts();
  //       }
  //     }
  //   }, 60000);
  // }, Math.random() * 20000);
}

main();

// cartDisp.addEventListener('click', function (event) {
//   var tgt = event.target;
//   if (
//     tgt.classList.contains('quantity-change') ||
//     tgt.classList.contains('remove-item')
//   ) {
//     var prodId = tgt.dataset.productId;
//     var itemElem = document.getElementById(prodId);
//     var prod = products.find(function (p) {
//       return p.id === prodId;
//     });
//     if (tgt.classList.contains('quantity-change')) {
//       var qtyChange = parseInt(tgt.dataset.change);
//       var newQty =
//         parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
//         qtyChange;
//       if (
//         newQty > 0 &&
//         newQty <=
//           prod.q +
//             parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
//       ) {
//         itemElem.querySelector('span').textContent =
//           itemElem.querySelector('span').textContent.split('x ')[0] +
//           'x ' +
//           newQty;
//         prod.q -= qtyChange;
//       } else if (newQty <= 0) {
//         itemElem.remove();
//         prod.q -= qtyChange;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else if (tgt.classList.contains('remove-item')) {
//       var remQty = parseInt(
//         itemElem.querySelector('span').textContent.split('x ')[1]
//       );
//       prod.q += remQty;
//       itemElem.remove();
//     }
//     calcCart();
//   }
// });
