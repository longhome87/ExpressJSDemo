// $(document).ready(function () {
//     $("#btnAddToCart").click(function () {
//         alert('this.value');
//     });
// });

function addToCart(id) {
    $.ajax({
        method: 'GET',
        url: '/shopping-carts/add-to-cart/' + id,
    }).done(function (result) {
        var span = document.getElementById('shoppingCartBadge');
        span.innerHTML = result.totalQty;
    })
}
