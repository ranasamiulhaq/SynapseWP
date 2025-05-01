<?php
if (!defined('ABSPATH')) {
    die;
}

class Synapse_Admin_Menu {
    public static function add_admin_menu() {
        add_menu_page(
            'Synapse AI Chatbot',
            'Synapse',
            'manage_options',
            'faq_rag_bot',
            ['Synapse_Admin_Menu', 'admin_dashboard'],
            'dashicons-format-chat',
            80
        );
    }

    public static function admin_dashboard() {
        include_once plugin_dir_path(__DIR__) . 'admin/partials/admin-dashboard.php';
    }

    public static function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_faq_rag_bot') {
            return;
        }

        wp_enqueue_style('synapse-admin-styles', plugin_dir_url(__DIR__) . 'admin/css/admin-styles.css');
        wp_enqueue_script('synapse-admin-upload', plugin_dir_url(__DIR__) . 'admin/js/admin-scripts.js', ['jquery'], false, true);

        wp_localize_script('synapse-admin-upload', 'faqbot_ajax', [
            'ajax_url'  => admin_url('admin-ajax.php'),
            'nonce'     => wp_create_nonce('fetch_products_nonce'),
        ]);

        $site_id = get_option('your_plugin_site_id');
        wp_localize_script('synapse-admin-upload', 'faqbotData', ['site_id' => $site_id]);
    }
}