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
                <div class="card-header">
                    <h2>🛒 WooCommerce Chatbot</h2>
                    <p>
                        Seamlessly connect your WooCommerce store with our AI chatbot to provide real-time assistance using your product catalog.
                    </p>
                </div>

                <form id="woo-config-form" method="post" action="<?php echo admin_url('admin-post.php'); ?>"
                      class="card-form">
                    <input type="hidden" name="action" value="woocommerce_config">
                    <div class="form-actions">
                        <button type="button" class="button-secondary" id="fetch-products-btn">
                            🛍️ Fetch Products
                        </button>
                    </div>

                    <div id="products-display" style="margin-top: 20px;"></div>

                    <div class="form-actions">
                        <input type="submit" class="button-primary" value="💾 Save Configuration">
                    </div>
                </form>
            </div>
        </div>

        <div id="tab-faq" class="tab-content">
            <div class="card">
                <h2>📄 Train FAQ Bot</h2>
                <form id="faqbot-upload-form" method="post" enctype="multipart/form-data"
                      action="<?php echo admin_url('admin-post.php'); ?>">
                    <input type="hidden" name="action" value="faqbot_upload">
                    <p><label for="faq_doc">Upload Document:</label></p>
                    <input type="file" name="faq_doc" id="faq_doc" accept=".pdf,.docx,.txt"/>
                    <p><label for="manual_faq">Manual Input:</label></p>
                    <textarea id="manual_faq" name="manual_faq"
                              placeholder="Paste questions and answers here..."></textarea>
                    <p><input type="submit" class="button-primary" value="🚀 Train FAQ Bot"></p>
                    <div id="faqbot-upload-status" style="display: none;">Processing...</div>
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