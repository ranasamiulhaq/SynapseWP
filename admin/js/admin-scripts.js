(function() {
    console.log("⚙️ admin.js loaded");
    console.log("here is id :" + faqbotData.site_id);

    function switchTab(event, tabId) {
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('nav-tab-active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        event.currentTarget.classList.add('nav-tab-active');
        document.getElementById(tabId).classList.add('active');
    }

    const woocommerceTabBtn = document.querySelector('.nav-tabs button[onclick*="tab-woocommerce"]');
    const faqTabBtn = document.querySelector('.nav-tabs button[onclick*="tab-faq"]');
    const settingsTabBtn = document.querySelector('.nav-tabs button[onclick*="tab-settings"]');

    if (woocommerceTabBtn) {
        woocommerceTabBtn.addEventListener('click', (event) => switchTab(event, 'tab-woocommerce'));
    }
    if (faqTabBtn) {
        faqTabBtn.addEventListener('click', (event) => switchTab(event, 'tab-faq'));
    }
    if (settingsTabBtn) {
        settingsTabBtn.addEventListener('click', (event) => switchTab(event, 'tab-settings'));
    }

    const uploadForm = document.getElementById('faqbot-upload-form');
    const uploadStatus = document.getElementById('faqbot-upload-status');

    if (uploadForm && uploadStatus) {
        uploadForm.addEventListener('submit', function (event) {
            uploadStatus.style.display = 'block';
        });
    }

    const fetchBtn = document.getElementById('fetch-products-btn');
    const wooLoadingIndicator = document.getElementById('woo-loading-indicator');
    const wooSuccessIndicator = document.getElementById('woo-success-indicator');
    const productsDisplayDiv = document.getElementById('products-display');

    if (fetchBtn && wooLoadingIndicator && wooSuccessIndicator && productsDisplayDiv) {
        fetchBtn.addEventListener('click', () => {
            wooLoadingIndicator.style.display = 'inline-block';
            wooSuccessIndicator.style.display = 'none';
            productsDisplayDiv.innerHTML = "<span class='loading-animation'></span> Fetching products and sending to backend...";

            fetch(ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    action: 'faqbot_fetch_products',
                    _ajax_nonce: faqbot_ajax.nonce
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const siteUrl = window.location.origin;
                    // Send the product data to your backend
                    return fetch('http://localhost:8000/plugin/api', { // Adjust the endpoint if needed
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            site_url: siteUrl,
                            site_id: faqbotData.site_id,
                            products: data.data
                        })
                    });
                } else {
                    const displayDiv = document.getElementById('products-display');
                    if (displayDiv) {
                        displayDiv.innerHTML = "<span class='error-message'>❌ Failed to fetch products.</span>";
                    }
                    wooLoadingIndicator.style.display = 'none';
                    return Promise.reject("Failed to fetch products");
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(backendData => {
                wooLoadingIndicator.style.display = 'none';
                wooSuccessIndicator.style.display = 'inline-block';
                const displayDiv = document.getElementById('products-display');
                if (displayDiv) {
                    displayDiv.innerHTML = "<span class='success-message'>✅ Bot is Ready to use !</span>";
                }
                console.log('Backend response:', backendData);
                // Optionally reset the success indicator after a short delay
                setTimeout(() => {
                    wooSuccessIndicator.style.display = 'none';
                }, 3000);
            })
            .catch(error => {
                console.error('Error sending to backend:', error);
                wooLoadingIndicator.style.display = 'none';
                const displayDiv = document.getElementById('products-display');
                if (displayDiv) {
                    displayDiv.innerHTML = `<span class='error-message'>❌ Error sending products to backend: ${error}</span>`;
                }
            });
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = uploadForm.querySelector('input[type="submit"]');
            const fileInput = document.getElementById('faq_doc');
            const manualFaqInput = document.getElementById('manual_faq');

            const file = fileInput.files[0];
            const manualFaq = manualFaqInput.value.trim();

            if (file && manualFaq) {
                if (uploadStatus) uploadStatus.innerText = "❌ Please either upload a file OR type FAQ — not both.";
                return;
            }

            if (!file && !manualFaq) {
                if (uploadStatus) uploadStatus.innerText = "❌ Please upload a file OR type your FAQ.";
                return;
            }

            const formData = new FormData();
            formData.append('site_id', faqbotData.site_id);

            let endpoint = '';

            if (file) {
                formData.append('file', file);
                endpoint = 'http://localhost:8000/plugin/doc';   // file upload endpoint
            } else if (manualFaq) {
                formData.append('manual_faq', manualFaq);
                endpoint = 'http://localhost:8000/plugin/manual'; // manual FAQ endpoint
            }

            if (uploadStatus){
                uploadStatus.innerText = "Uploading... 🚀";
                submitBtn.disabled = true;
            }

            fetch(endpoint, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (uploadStatus) uploadStatus.innerText = "✅ Successfully sent!";
                console.log('Server response:', data);
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Upload error:', error);
                if (uploadStatus) uploadStatus.innerText = "❌ Error sending data.";
                submitBtn.disabled = false;
            });
        });
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Ensure these elements exist
    const woocommerceTabButton = document.querySelector('.nav-tabs button[onclick*="tab-woocommerce"]');
    if (woocommerceTabButton) {
        // Add the loading and success indicators to the button
        woocommerceTabButton.innerHTML += `
            <span id="woo-loading-indicator" class="dashicons dashicons-update dashicons-spin" style="display: none;"></span>
            <span id="woo-success-indicator" class="dashicons dashicons-yes" style="color: #4CAF50; display: none;"></span>
        `;
    }
});

document.addEventListener('DOMContentLoaded', function() {
        const checkbox = document.getElementById('agreement-checkbox');
        const fetchProductsBtn = document.getElementById('fetch-products-btn');
        const form = document.getElementById('woo-config-form');

        checkbox.addEventListener('change', function() {
            fetchProductsBtn.disabled = !this.checked;
        });

        fetchProductsBtn.addEventListener('click', function() {
            if (checkbox.checked) {
                form.submit(); // Only submit the form if the checkbox is checked
            } else {
                alert('Please check the box to agree before proceeding.'); // Optional: Inform the user
            }
        });
    });