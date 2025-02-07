document.getElementById('addToCart').addEventListener('click', function () {
    const productId = this.getAttribute('data-product-id');
    const cartId = localStorage.getItem('cartId');

    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Producto agregado al carrito:', data.payload);
    })
    .catch(error => {
        console.error('Error al agregar el producto al carrito:', error);
    });
})