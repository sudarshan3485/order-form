// Image Gallery Logic
function changeImage(element) {
    // Update main image
    const mainImg = document.getElementById('main-product-image');
    mainImg.src = element.src;

    // Update active state on thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

// Dynamic Order Items & Pricing Logic
document.addEventListener('DOMContentLoaded', () => {
    const orderItemsList = document.getElementById('order-items-list');
    const addItemBtn = document.getElementById('add-item-btn');
    const estPriceDisplay = document.getElementById('est-price');
    
    const SINGLE_PRICE = 6000;
    const BULK_PRICE = 3600;
    const BULK_THRESHOLD = 10;

    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    function calculateTotalPrice() {
        const qtyInputs = document.querySelectorAll('.qty-input');
        let totalQty = 0;
        
        qtyInputs.forEach(input => {
            const val = parseInt(input.value);
            if (!isNaN(val) && val > 0) {
                totalQty += val;
            }
        });

        if (totalQty === 0) {
            estPriceDisplay.textContent = '₹0';
            return;
        }

        const unitPrice = totalQty >= BULK_THRESHOLD ? BULK_PRICE : SINGLE_PRICE;
        const totalPrice = totalQty * unitPrice;
        
        estPriceDisplay.textContent = formatCurrency(totalPrice);
    }

    function updateRemoveButtons() {
        const removeBtns = document.querySelectorAll('.remove-item-btn');
        // Disable remove button if there's only one item left
        removeBtns.forEach(btn => {
            btn.disabled = removeBtns.length <= 1;
        });
    }

    function attachEventListeners(itemRow) {
        const qtyInput = itemRow.querySelector('.qty-input');
        qtyInput.addEventListener('input', calculateTotalPrice);
        
        const removeBtn = itemRow.querySelector('.remove-item-btn');
        removeBtn.addEventListener('click', () => {
            itemRow.remove();
            calculateTotalPrice();
            updateRemoveButtons();
        });
    }

    // Attach to the initial row
    attachEventListeners(orderItemsList.querySelector('.order-item'));
    updateRemoveButtons();

    addItemBtn.addEventListener('click', () => {
        const firstRow = orderItemsList.querySelector('.order-item');
        const newRow = firstRow.cloneNode(true);
        
        // Reset inputs
        newRow.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        const newQtyInput = newRow.querySelector('.qty-input');
        newQtyInput.value = '';
        
        orderItemsList.appendChild(newRow);
        
        attachEventListeners(newRow);
        updateRemoveButtons();
    });

    // Form submission animation (optional UX enhancement)
    const form = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', () => {
        // Just add loading state while formsubmit processes the request
        submitBtn.classList.add('loading');
        // Let the form submit naturally
    });
});
