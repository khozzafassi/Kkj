// script.js
function toggleMenu() {
    try {
        const nav = document.getElementById('nav');
        const hamburger = document.querySelector('.hamburger');
        const isExpanded = nav.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', isExpanded);
    } catch (e) {
        console.error('Error toggling menu:', e);
    }
}

function preloadImages(images) {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function addToCart(name, price, images) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cart.find(i => i.name === name);
        if (item) item.qty += 1;
        else cart.push({ name, price, images, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} added to cart!`);
    } catch (e) {
        console.error('Error adding to cart:', e);
        alert('Error adding item to cart. Please try again.');
    }
}

function loadCart() {
    try {
        const cartItemsDiv = document.getElementById('cartItems');
        if (!cartItemsDiv) return;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            document.getElementById('totalAmount').innerHTML = '';
            return;
        }
        preloadImages(cart.map(item => item.images[0]));
        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.images[0] || 'image/default.jpg'}" alt="${item.name} - Cart item" loading="lazy" width="100" height="100" onerror="this.src='image/default.jpg';">
                    <div>
                        <h3>${item.name}</h3>
                        <div class="price">₹${item.price} x ${item.qty}</div>
                        <div class="qty">Subtotal: ₹${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove ${item.name} from cart">Remove</button>
            `;
            cartItemsDiv.appendChild(div);
        });
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        document.getElementById('totalAmount').innerHTML = `Total: ₹${total.toFixed(2)}`;
    } catch (e) {
        console.error('Error loading cart:', e);
        alert('Error loading cart. Please try again.');
    }
}

function removeItem(index) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }
    } catch (e) {
        console.error('Error removing item:', e);
        alert('Error removing item. Please try again.');
    }
}

function goToCheckout() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Your cart is empty. Please add items before proceeding.');
        }
    } catch (e) {
        console.error('Error proceeding to checkout:', e);
        alert('Error proceeding to checkout. Please try again.');
    }
}

function loadProductSummary() {
    try {
        const productSummary = document.getElementById('productSummary');
        if (!productSummary) return;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let totalAmount = 0;
        if (cart.length > 0) {
            preloadImages(cart.map(item => item.images[0]));
            let summaryHTML = '<ul style="list-style:none;padding:0;">';
            cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                totalAmount += itemTotal;
                summaryHTML += `<li style="margin-bottom:8px; display:flex; align-items:center;">
                    <img src="${item.images[0] || 'image/default.jpg'}" alt="${item.name} - Cart item" loading="lazy" width="100" height="100" onerror="this.src='image/default.jpg';">
                    <div><strong>${item.name}</strong> × ${item.qty} - ₹${itemTotal.toFixed(2)}</div>
                </li>`;
            });
            summaryHTML += `</ul><div class="priceDisplay">Total: ₹${totalAmount.toFixed(2)}</div>`;
            productSummary.innerHTML = summaryHTML;
        } else {
            productSummary.innerHTML = '<p style="color:var(--muted);">No items in cart. Please add items from <a href="index.html">Home</a>.</p>';
            document.querySelector('.row').style.display = 'none';
        }
    } catch (e) {
        console.error('Error loading product summary:', e);
        productSummary.innerHTML = '<p style="color:var(--error);">Error loading cart. Please try again.</p>';
    }
}

function generateOrderId() {
    const d = new Date();
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `KHOZZA-${y}${mo}${da}-${rand}`;
}

function validateAndSave() {
    try {
        const name = document.getElementById('name')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const countryCode = document.getElementById('countryCode')?.value;
        const pincode = document.getElementById('pincode')?.value.trim();
        const address = document.getElementById('address')?.value.trim();
        document.getElementById('nameError').textContent = '';
        document.getElementById('phoneError').textContent = '';
        document.getElementById('pincodeError').textContent = '';
        document.getElementById('addressError').textContent = '';
        document.getElementById('upiRefError').textContent = '';
        document.getElementById('name').removeAttribute('aria-invalid');
        document.getElementById('phone').removeAttribute('aria-invalid');
        document.getElementById('pincode').removeAttribute('aria-invalid');
        document.getElementById('address').removeAttribute('aria-invalid');
        let valid = true;
        if (!name) {
            document.getElementById('nameError').textContent = 'Full name is required.';
            document.getElementById('name').setAttribute('aria-invalid', 'true');
            valid = false;
        }
        if (!phone || !/^\d+$/.test(phone)) {
            document.getElementById('phoneError').textContent = 'Valid phone number is required (digits only).';
            document.getElementById('phone').setAttribute('aria-invalid', 'true');
            valid = false;
        }
        if (!pincode || !/^\d{5,10}$/.test(pincode)) {
            document.getElementById('pincodeError').textContent = 'Valid pincode is required (5-10 digits).';
            document.getElementById('pincode').setAttribute('aria-invalid', 'true');
            valid = false;
        }
        if (!address) {
            document.getElementById('addressError').textContent = 'Full address is required.';
            document.getElementById('address').setAttribute('aria-invalid', 'true');
            valid = false;
        }
        if (!valid) return;
        const sanitizedName = name.replace(/<script>/gi, '');
        const sanitizedPhone = phone.replace(/<script>/gi, '');
        const sanitizedPincode = pincode.replace(/<script>/gi, '');
        const sanitizedAddress = address.replace(/<script>/gi, '');
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'flex';
        let count = 5;
        const countdownElem = document.getElementById('countdown');
        countdownElem.innerText = count;
        const interval = setInterval(() => {
            count--;
            countdownElem.innerText = count;
            if (count <= 0) {
                clearInterval(interval);
                overlay.style.display = 'none';
                document.getElementById('checkoutCard').style.display = 'none';
                const upiSection = document.getElementById('upiSection');
                upiSection.style.display = 'block';
                document.getElementById('upiAmount').innerText = `Amount: ₹${totalAmount.toFixed(2)}`;
                window.tempOrder = { name: sanitizedName, phone: countryCode + sanitizedPhone, pincode: sanitizedPincode, address: sanitizedAddress };
            }
        }, 1000);
    } catch (e) {
        console.error('Error validating form:', e);
        alert('Error processing form. Please try again.');
    }
}

function confirmOrder() {
    try {
        const upiRef = document.getElementById('upiRef').value.trim();
        document.getElementById('upiRefError').textContent = '';
        document.getElementById('upiRef').removeAttribute('aria-invalid');
        if (!/^\d{12}$/.test(upiRef)) {
            document.getElementById('upiRefError').textContent = 'Please enter a valid 12-digit UPI reference number.';
            document.getElementById('upiRef').setAttribute('aria-invalid', 'true');
            return;
        }
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const orderId = generateOrderId();
        const order = { ...window.tempOrder, items: cart, totalAmount, orderId, status: 'Confirmed', upiRef };
        const orders = JSON.parse(localStorage.getItem('khozzaOrders') || '[]');
        orders.push(order);
        localStorage.setItem('khozzaOrders', JSON.stringify(orders));
        localStorage.removeItem('cart');
        document.getElementById('upiSection').style.display = 'none';
        document.getElementById('orderConfirm').style.display = 'block';
        document.getElementById('orderNum').textContent = orderId;
        document.getElementById('orderDetails').textContent = `Total Items: ${cart.length} — ₹${totalAmount.toFixed(2)}`;
    } catch (e) {
        console.error('Error confirming order:', e);
        alert('Error confirming order. Please try again.');
    }
}

function copyOrderID() {
    try {
        const orderID = document.getElementById('orderNum').textContent;
        navigator.clipboard.writeText(orderID).then(() => {
            alert('Order ID copied to clipboard');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Failed to copy Order ID. Please copy manually.');
        });
    } catch (e) {
        console.error('Error copying Order ID:', e);
        alert('Error copying Order ID. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        if (document.querySelector('.swiper')) {
            new Swiper('.swiper', {
                loop: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
            });
        }
        if (document.getElementById('cartItems')) loadCart();
        if (document.getElementById('productSummary')) loadProductSummary();
        document.getElementById('yr').textContent = new Date().getFullYear();
    } catch (e) {
        console.error('Error initializing page:', e);
    }
});