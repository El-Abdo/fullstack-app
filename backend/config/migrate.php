<?php

require 'config.php';

try {
    $sql = "
            drop table if exists attribute_items;           
            drop table if exists attributes;
            drop table if exists product_gallery;
            drop table if exists prices;
            drop table if exists orders;
            drop table if exists products;
            CREATE TABLE if not exists products (
                id BIGINT AUTO_INCREMENT PRIMARY KEY, 
                name VARCHAR(255) NOT NULL,
                in_stock BOOLEAN NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(255) NOT NULL,
                brand VARCHAR(255) NOT NULL
            );

            CREATE TABLE if not exists orders (
                id BIGINT AUTO_INCREMENT PRIMARY KEY, 
                product_id BIGINT  NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );

            CREATE TABLE if not exists product_gallery (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                product_id BIGINT  NOT NULL,
                image_url TEXT NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );

            CREATE TABLE if not exists prices (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                product_id BIGINT NOT NULL,
                currency VARCHAR(10) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                symbol VARCHAR(2) NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );

            CREATE TABLE if not exists attributes (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                product_id BIGINT NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );

            CREATE TABLE if not exists attribute_items (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                attribute_id BIGINT NOT NULL,
                display_value VARCHAR(255) NOT NULL,
                value VARCHAR(255) NOT NULL,
                item_id VARCHAR(50) NOT NULL,
                FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
            );
            ";

    $pdo->exec($sql);
    echo "Tables created successfully";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
