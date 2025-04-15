// store
import { store } from './store';

// validate
import { isOutOfStock } from './utils/validate';

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

var sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

/**
 * 분석
 * - 전체 UI를 최초 생성함
 * - 30초와 1분 마다 alert 발생과 함께 셀렉트 박스의 옵션이 변경됨
 */
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

  function handleClick(event) {
    const elementId = event.target.id;

    if (elementId === 'add-to-cart') {
      handleAddCart();
    }
  }

  function handleChange(event) {
    const elementId = event.target.id;

    if (elementId === 'product-select') {
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

function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  var cartItems = cartDisp.children;
  var subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          curItem = products[j];
          break;
        }
      }
      var q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      var itemTot = curItem.val * q;
      var disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        else if (curItem.id === 'p2') disc = 0.15;
        else if (curItem.id === 'p3') disc = 0.2;
        else if (curItem.id === 'p4') disc = 0.05;
        else if (curItem.id === 'p5') disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    var bulkDisc = totalAmt * 0.25;
    var itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
  if (discRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }
  // updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPts = Math.floor(totalAmt / 1000);
  var ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

// function updateStockInfo() {
//   var infoMsg = '';
//   products.forEach(function (item) {
//     if (item.q < 5) {
//       infoMsg +=
//         item.name +
//         ': ' +
//         (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
//         '\n';
//     }
//   });
//   stockInfo.textContent = infoMsg;
// }

main();

// 1. 카트에 추가되는 함수 만들기
// 2. 카트 컴포넌트에 추가된 상품 반복하기
function findProductById(targetId) {
  const { products } = store.getState();
  return products.find((product) => product.id === targetId);
}

function findCartProductById(targetId) {
  const { cartProducts } = store.getState();
  return cartProducts.find((product) => product.id === targetId);
}

function hasCartProductById(targetId) {
  const { cartProducts } = store.getState();
  return cartProducts.some((product) => product.id === targetId);
}

function handleAddCart() {
  const { selectedProductId, products, cartProducts } = store.getState();

  const selectedProduct = findProductById(selectedProductId);

  if (!isOutOfStock(selectedProduct)) {
    alert('재고가 부족합니다.');
    return;
  }

  if (!hasCartProductById(selectedProductId)) {
    const newProducts = products.map((product) => {
      if (product.id === selectedProductId) {
        return { ...product, q: --product.q };
      }

      return product;
    });

    store.setState({
      products: newProducts,
      cartProducts: [...cartProducts, { ...selectedProduct, q: 1 }],
    });
    return;
  }

  const newProducts = products.map((product) => {
    if (product.id === selectedProductId) {
      return { ...product, q: --product.q };
    }

    return product;
  });

  const newCartProducts = cartProducts.map((product) => {
    if (product.id === selectedProductId) {
      return { ...product, q: ++product.q };
    }

    return product;
  });

  store.setState({
    products: newProducts,
    cartProducts: newCartProducts,
  });
}

function handleSelectProduct(targetId) {
  const selected = findProductById(targetId);
  store.setState({ selectedProductId: selected.id });
}

addBtn.addEventListener('click', function () {
  // 선택되어 있는 셀렉트 박스 옵션과 products와 비교해서 같은 상품 찾아서 카트에 추가하려는 용도 같음
  var selItem = sel.value;
  var itemToAdd = products.find(function (p) {
    return p.id === selItem;
  });
  // 추가하려는 상품이 개수가 0개 이상일 때
  if (itemToAdd && itemToAdd.q > 0) {
    var item = document.getElementById(itemToAdd.id);

    // 이미 해당 엘리먼트가 존재할 경우에 기존 엘리먼트 찾아서 갯수 변경함
    // 실패하면 재고 부족 경고창
    // 추가 후 추가된 만큼 product.q -함
    if (item) {
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 카트에 추가될 엘리먼트 생성 후 추가
      // 추가 후 추가된 만큼 product.q -함
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    // 추가된 정보로 계산 다시 때림
    calcCart();
    lastSel = selItem; // 이건 아직 뭐하는 용도인지 모르겠음
  }
});

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
