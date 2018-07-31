const SOCKET = {
    CONNECTION: 'connection',
    CREATE: 'create',
    CHAT: 'chat',
    IN_CHAT: 'in_chat'
};

function addToCart(id) {
    $.ajax({
        method: 'GET',
        url: '/shopping-carts/add-to-cart/' + id,
    }).done(function (result) {
        var span = document.getElementById('shoppingCartBadge');
        span.innerHTML = result.totalQty;
    })
};
