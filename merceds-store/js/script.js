$(document).ready(function () {

    // ==========================================
    // 1. دالة حفظ السيارات في LocalStorage
    // ==========================================
    function saveToCart(carName, carPrice, carImage) {
        let cart = JSON.parse(localStorage.getItem('mercedes_cart')) || [];
        
        let existingIndex = cart.findIndex(item => item.name === carName);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                name: carName,
                price: carPrice,
                image: carImage,
                quantity: 1
            });
        }

        localStorage.setItem('mercedes_cart', JSON.stringify(cart));

        if (typeof toastr !== 'undefined') {
            toastr.success('تمت إضافة ' + carName + ' إلى سلة المحفوظات!');
        } else {
            alert('تمت إضافة ' + carName + ' إلى سلة المحفوظات!');
        }
    }

    // ==========================================
    // 2. أحداث أزرار إضافة للسلة وشراء الآن
    // ==========================================
    $(document).on('click', '.add-to-cart-btn, .buy-now-btn', function (e) {
        var card = $(this).closest('.card');
        var carName = $(this).attr('data-car') || card.find('.card-title').text().trim();
        var carPrice = card.find('.card-text').text().trim();
        var carImage = card.find('.card-img-top').attr('src') || 'images/car1.jpg';

        saveToCart(carName, carPrice, carImage);

        // إذا تم الضغط على "شراء الآن" نفتح نافذة الدفع
        if ($(this).hasClass('buy-now-btn')) {
            var paymentModalEl = document.getElementById('paymentModal');
            if (paymentModalEl) {
                var paymentModal = new bootstrap.Modal(paymentModalEl);
                paymentModal.show();
            }
        }
    });

    // ==========================================
    // 3. دالة عرض محتويات السلة في صفحة cart.html
    // ==========================================
    function displayCart() {
        var cartTableBody = $('#cartTableBody');
        if (cartTableBody.length === 0) return; // الخروج إذا لم نكن في صفحة السلة

        let cart = JSON.parse(localStorage.getItem('mercedes_cart')) || [];
        cartTableBody.empty();

        if (cart.length === 0) {
            cartTableBody.html('<tr><td colspan="4" class="text-center py-5 text-muted fs-5">لا توجد سيارات محفوظة في السلة حالياً</td></tr>');
            return;
        }

        cart.forEach(function (item, index) {
            cartTableBody.append(`
                <tr>
                    <td class="d-flex align-items-center justify-content-center gap-3">
                        <img src="${item.image}" width="70" height="45" style="object-fit:cover;" class="rounded border">
                        <span class="fw-bold">${item.name}</span>
                    </td>
                    <td>${item.price}</td>
                    <td><span class="badge bg-secondary fs-6">${item.quantity}</span></td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-cart-item" data-index="${index}">
                            <i class="fa-solid fa-trash"></i> حذف
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    // تشغيل دالة العرض مباشرة
    displayCart();

    // ==========================================
    // 4. زر حذف عنصر واحد من السلة
    // ==========================================
    $(document).on('click', '.remove-cart-item', function () {
        let index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('mercedes_cart')) || [];

        cart.splice(index, 1);
        localStorage.setItem('mercedes_cart', JSON.stringify(cart));
        displayCart();

        if (typeof toastr !== 'undefined') toastr.warning('تم حذف السيارة من السلة');
    });

    // ==========================================
    // 5. زر تفريغ السلة بالكامل (الجديد والمحدث)
    // ==========================================
    $(document).on('click', '#clearCartBtn', function (e) {
        e.preventDefault();

        let cart = JSON.parse(localStorage.getItem('mercedes_cart')) || [];
        if (cart.length === 0) {
            if (typeof toastr !== 'undefined') {
                toastr.warning('السلة فارغة بالفعل!');
            } else {
                alert('السلة فارغة بالفعل!');
            }
            return;
        }

        // تفريغ البيانات من المتصفح وإعادة رسم الجدول
        localStorage.removeItem('mercedes_cart');
        displayCart();

        if (typeof toastr !== 'undefined') {
            toastr.error('تم تفريغ السلة بالكامل!');
        } else {
            alert('تم تفريغ السلة بالكامل!');
        }
    });

    // ==========================================
    // 6. زر التفاصيل عبر Ajax Modal
    // ==========================================
    $(document).on('click', '.ajax-modal-btn', function () {
        var carModalEl = document.getElementById('carModal');
        if (carModalEl) {
            var carModal = new bootstrap.Modal(carModalEl);
            carModal.show();
            $('#modalBody').load('modal-content.html', function (response, status) {
                if (status === "error") {
                    $('#modalBody').html('<p class="text-danger text-center py-3">تعذر تحميل التفاصيل. تأكد من وجود ملف modal-content.html</p>');
                }
            });
        }
    });

    // ==========================================
    // 7. زر تأكيد الشراء في Modal الدفع
    // ==========================================
    $(document).on('click', '#confirmPaymentBtn', function () {
        var paymentModalEl = document.getElementById('paymentModal');
        if (paymentModalEl) {
            var modalInstance = bootstrap.Modal.getInstance(paymentModalEl);
            if (modalInstance) modalInstance.hide();
        }
        if (typeof toastr !== 'undefined') toastr.info('تم استلام طلب الشراء بنجاح! سيتم التواصل معك قريباً.');
    });

    // ==========================================
    // 8. نموذج تواصل معنا (contact.html)
    // ==========================================
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        if (typeof toastr !== 'undefined') {
            toastr.success('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت.');
        } else {
            alert('تم إرسال رسالتك بنجاح!');
        }
        this.reset();
    });

});