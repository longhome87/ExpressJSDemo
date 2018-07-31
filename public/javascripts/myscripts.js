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
        var shoppingCartBadge = document.getElementById('shoppingCartBadge');
        var shoppingCartBadgeMini = document.getElementById('shoppingCartBadgeMini');
        shoppingCartBadge.innerHTML = result.totalQty;
        shoppingCartBadgeMini.innerHTML = result.totalQty;
    })
    return false;
};
