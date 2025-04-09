<?php

namespace Abdelrahman\Backend\Repository;

use Abdelrahman\Backend\Factory\AttributeFactory;
use Abdelrahman\Backend\Factory\ProductFactory;
use Abdelrahman\Backend\Model\AttributeItem;

class ProductRepository
{
    public function __construct(private \PDO $connection)
    {
    }

    public function findByCategory(?string $category = null): array
    {
        $sql = "SELECT p.*, 
            pr.currency as price_currency, pr.amount as price_amount, pr.symbol as price_symbol, 
            a.id as attr_id, a.name as attr_name, a.type as attr_type,
            ai.display_value as attr_display_value, ai.value as attr_value
            FROM products p
            LEFT JOIN prices pr ON p.id = pr.product_id
            LEFT JOIN attributes a ON p.id = a.product_id
            LEFT JOIN attribute_items ai ON a.id = ai.attribute_id";

        if ($category !== null) {
            $sql .= " WHERE p.category = ?";
        }

        $stmt = $this->connection->prepare($sql);

        if ($category !== null) {
            $stmt->execute([$category]);
        } else {
            $stmt->execute();
        }

        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if ($results === false) {
            throw new \RuntimeException('Failed to fetch products');
        }

        return $this->hydrateProducts($results);
    }
    private function hydrateProducts(array $rows): array
    {
        $products = [];
        $currentProductId = null;
        $currentProduct = null;

        foreach ($rows as $row) {
            // New product
            if ($currentProductId !== $row['id']) {
                if ($currentProduct !== null) {
                    $products[] = $currentProduct;
                }

                $currentProduct = ProductFactory::create([
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'category' => $row['category'],
                    'brand' => $row['brand'],
                    'in_stock' => (bool)$row['in_stock']
                ]);

                $currentProduct->setPrice([
                    'amount' => $row['price_amount'],
                    'symbol' => $row['price_symbol'],
                    'currency' => $row['price_currency']
                ]);

                $currentProductId = $row['id'];
                continue;
            }

            // Add attribute if exists
            if ($row['attr_id'] && !isset($currentProduct->getAttributes()[$row['attr_id']])) {
                $attribute = AttributeFactory::create([
                    'id' => $row['attr_id'],
                    'name' => $row['attr_name'],
                    'type' => $row['attr_type']
                ], [
                    new AttributeItem($row['attr_display_value'], $row['attr_value'])
                ]);

                $currentProduct->addAttribute($attribute);
            }
        }

        // Add the last product
        if ($currentProduct !== null) {
            $products[] = $currentProduct;
        }

        return $products;
    }
}
