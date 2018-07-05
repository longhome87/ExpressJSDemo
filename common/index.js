// class TABLE {
//     static const Product = 'product';
// }

// module.exports = TABLE;
// export static const TABLE = {
//     Product = 'product'
// }
class TABLE {
    static get Product() {
        return 'product';
    }
}

module.exports = TABLE;