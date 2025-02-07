document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('cartId')) {
        fetch('api/carts', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                sessionStorage.setItem('cartId', data.payload._id);
                updateCartLink(data.payload._id);
            })
            .catch(error => {
                console.error('Error al obtener el carrito:', error);
            });
    } else {
        updateCartLink(sessionStorage.getItem('cartId'));
    }
});

function updateCartLink(cartId) {
    const cartLink = document.getElementById('cart-link');
    cartLink.href = `/carts/${cartId}`;
}