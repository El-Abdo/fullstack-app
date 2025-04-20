<?php

namespace Abdelrahman\Backend\Service;

class OrderService
{
    public function __construct(
        private \PDO $connection
    ) {
    }

    public function createOrder(array $order): void
    {
        $stmt = $this->connection->prepare('INSERT INTO orders (product_id, attribute_id, attribute_item_id, quantity) VALUES (?, ?, ?, ?)');
        foreach ($order['items'] as $item) {
            $stmt->execute([
                $item['product_id'],
                $item['attribute_id'],
                $item['attribute_item_id'],
                $item['quantity']
            ]);
        }
    }
}
