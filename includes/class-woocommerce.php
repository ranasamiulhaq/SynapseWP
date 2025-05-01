<?php
if (!defined('ABSPATH')) {
    die;
}

class Synapse_WooCommerce {
    public static function fetch_products() {
        check_ajax_referer('fetch_products_nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Unauthorized');
        }

        $args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
        ];

        $query = new WP_Query($args);
        $products = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                global $product;
                $products[] = [
                    'id'                => get_the_ID(),
                    'title'             => get_the_title(),
                    'price'             => $product->get_price(),
                    'link'              => get_permalink(),
                    'description'       => get_the_content(),
                    'short_description' => get_the_excerpt(),
                    'stock_status'      => $product->get_stock_status(), // Corrected
                    'stock_quantity'    => $product->get_stock_quantity(), // Corrected
                ];
            }
            wp_reset_postdata();
        }

        wp_send_json_success($products);
    }
}
?>