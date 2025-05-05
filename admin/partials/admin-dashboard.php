<div class="wrap" id="synapse-wrapper">
    <div class="synapse-header-box">
        <div class="synapse-header-text">
            <span class="badge-new">New Features</span>
            <h1>Introducing Synapse Chatbot</h1>
            <p>
                Synapse is an advanced AI chatbot plugin for WordPress, designed to elevate on-site customer engagement through intelligent, context-aware conversations. Powered by Retrieval-Augmented Generation (RAG), Synapse enables businesses to deploy a specialized chatbot tailored to their website content and user needs.
            </p>
        </div>
        <div class="synapse-header-image">
            <img src="<?php echo plugins_url('../../assets/images/bot.svg', __FILE__); ?>" alt="Chatbot illustration" />
        </div>
    </div>

    <div class="nav-tabs">
        <button class="nav-tab nav-tab-active" onclick="switchTab(event, 'tab-woocommerce')">
            🛒 WooCommerce Bot
            <span id="woo-loading-indicator" class="dashicons dashicons-update dashicons-spin" style="display: none;"></span>
            <span id="woo-success-indicator" class="dashicons dashicons-yes" style="color: #4CAF50; display: none;"></span>
        </button>
        <button class="nav-tab" onclick="switchTab(event, 'tab-faq')">📄 FAQ Bot</button>
        <button class="nav-tab" onclick="switchTab(event, 'tab-settings')">⚙️ Settings</button>
    </div>

    <div class="tab-container">
        <div id="tab-woocommerce" class="tab-content active">
            <div class="card modern-card">
                <div class="card-content">
                        <div class="card-header">
                        <h2 style="font-size: 26px; font-weight: 700; color: #333; margin-bottom: 10px;">
                            WooCommerce AI Chat
                        </h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #555; text-align: justify; margin-bottom: 15px;">
                            Integrate our intelligent AI chatbot directly into your WooCommerce store. This powerful tool provides instant support to your customers by leveraging your existing product information, leading to improved engagement and a more seamless shopping experience.
                        </p>
                        <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: justify; margin-bottom: 10px; font-style: italic;">
                            <strong style="font-weight: 600; color: #d35400;">Important Note:</strong> To enable this feature, your product data will be securely transmitted to our servers for efficient processing. Please ensure you possess the necessary authorization to share this information.
                        </p>
                        <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: justify; margin-bottom: 10px;">
                            We are committed to protecting your privacy. Rest assured that your data will be handled with the utmost confidentiality and will not be disclosed to any external parties without your explicit consent.
                        </p>
                    </div>

                    <form id="woo-config-form" method="post" action="<?php echo admin_url('admin-post.php'); ?>"
                        class="card-form">
                        <input type="hidden" name="action" value="woocommerce_config">
                        <div class="form-actions">
                            <button type="button" class="button-primary" id="fetch-products-btn">
                                Start Processing
                            </button>
                        </div>

                        <div id="products-display" style="margin-top: 20px;"></div>

                    </form>
                </div>

                <div class="card-content">
                    <div class="Woo-image">
                        <img src="<?php echo plugins_url('../../assets/images/Woo.jpg', __FILE__); ?>" alt="How it works" />
                    </div>
                </div>
            </div>
            
        </div>

        <div id="tab-faq" class="tab-content">
            <div class="card modern-card" style="flex-direction: column; align-items: stretch;">
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 26px; font-weight: 700; color: #333; margin-bottom: 10px;">
                        FAQ Bot
                    </h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #555; text-align: justify; margin-bottom: 15px;">
                        Supercharge your customer support by training an intelligent AI chatbot with your frequently asked questions and their answers. This allows you to provide instant, accurate responses, improving user satisfaction and freeing up your support team.
                    </p>
                    <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: justify; margin-bottom: 15px;">
                        You have two convenient options to train your FAQ Bot:
                    </p>
                    <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 15px; color: #777;">
                        <li style="margin-bottom: 5px;"><strong>Upload Document:</strong> Easily upload your FAQ documents in formats such as PDF, DOCX, or TXT. Our system will process the content to train the bot.</li>
                        <li style="margin-bottom: 5px;"><strong>Manual Input:</strong> Directly paste your questions and answers into the text area provided for immediate training.</li>
                    </ul>
                    <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: justify; margin-bottom: 20px;">
                        Choose the method that best suits your needs to create a comprehensive and helpful FAQ Bot for your website visitors.
                    </p>
                </div>
                <form id="faqbot-upload-form" method="post" enctype="multipart/form-data"
                    action="<?php echo admin_url('admin-post.php'); ?>" class="card-form">
                    <input type="hidden" name="action" value="faqbot_upload">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="faq_doc" style="display: block; font-weight: 600; color: #333; margin-bottom: 8px;">Upload FAQ Document:</label>
                        <input type="file" name="faq_doc" id="faq_doc" accept=".pdf,.docx,.txt"
                            style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="manual_faq" style="display: block; font-weight: 600; color: #333; margin-bottom: 8px;">Manually Enter FAQs:</label>
                        <textarea id="manual_faq" name="manual_faq"
                                placeholder="Paste questions and answers here..."
                                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; min-height: 150px; font-family: 'Montserrat', sans-serif; font-size: 14px;"></textarea>
                    </div>
                    <div class="form-actions" style="text-align: left;">
                        <input type="submit" class="button-primary" value="Train FAQ Bot"
                            style="background-color: #4CAF50; color: #fff; padding: 12px 24px; font-size: 16px; border: none; border-radius: 10px; cursor: pointer; transition: background-color 0.3s ease, box-shadow 0.2s ease-in-out; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    </div>
                    <div id="faqbot-upload-status" style="display: none; margin-top: 15px; font-weight: bold;">Processing...</div>
                </form>
            </div>
        </div>

        <div id="tab-settings" class="tab-content">
            <div class="card">
                <h2>⚙️ Settings</h2>
                <p>Configure additional settings for your chatbot.</p>
                <a href="#" class="button-secondary">Open Settings</a>
            </div>
        </div>
    </div>
</div>