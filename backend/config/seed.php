<?php
require 'config.php';

$jsonString = file_get_contents('backend/config/data.json');
$data = json_decode($jsonString, true);

$insertProduct = $pdo->prepare("INSERT INTO products (name, in_stock, description, category, brand) VALUES (?, ?, ?, ?, ?)");

foreach ($data['data']['products'] as $product) {
    $insertProduct->execute([
        $product['name'],
        (int) $product['inStock'],
        $product['description'],
        $product['category'],
        $product['brand']
    ]);
    $productId = $pdo->lastInsertId();

    $insertGallery = $pdo->prepare("INSERT INTO product_gallery (product_id, image_url) VALUES (?, ?)");
    foreach ($product['gallery'] as $imageUrl) {
        $insertGallery->execute([$productId, $imageUrl]);
    }

    $insertPrice = $pdo->prepare("INSERT INTO prices (product_id, currency, amount, symbol) VALUES (?, ?, ?, ?)");
    foreach ($product['prices'] as $price) {
        $insertPrice->execute([$productId, $price['currency']['label'], $price['amount'], $price['currency']['symbol']]);
    }

    $insertAttribute = $pdo->prepare("INSERT INTO attributes (product_id, name, type) VALUES (?, ?, ?)");
    $insertAttributeItem = $pdo->prepare("INSERT INTO attribute_items (attribute_id, display_value, value, item_id) VALUES (?, ?, ?, ?)");
    
    foreach ($product['attributes'] as $attribute) {
        $insertAttribute->execute([$productId, $attribute['name'], $attribute['type']]);
        $attributeId = $pdo->lastInsertId();

        foreach ($attribute['items'] as $item) {
            $insertAttributeItem->execute([$attributeId, $item['displayValue'], $item['value'], $item['id']]);
        }
    }
}
