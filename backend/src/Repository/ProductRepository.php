<?php

namespace Abdelrahman\Backend\Repository;

use Abdelrahman\Backend\Factory\ProductFactory;

class ProductRepository
{
    public function __construct(
        private \PDO $connection,
        private AttributeRepository $attributeRepository
    ) {
    }

    public function findByCategory(?string $category = null): array
    {
        $sql = "SELECT p.*, 
                pr.currency as price_currency, pr.amount as price_amount, pr.symbol as price_symbol,
                g.image_url
                FROM products p
                LEFT JOIN prices pr ON p.id = pr.product_id
                LEFT JOIN product_gallery g ON p.id = g.product_id";

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
        $gallery = [];

        foreach ($rows as $row) {
            $productId = $row['id'];

            if ($currentProductId !== $productId) {
                if ($currentProduct !== null) {
                    $currentProduct->setGallery($gallery);
                    $currentProduct->setAttributes(
                        $this->attributeRepository->findByProductId($currentProductId)
                    );
                    $products[] = $currentProduct;
                }

                $gallery = [];

                $currentProduct = ProductFactory::create([
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'category' => $row['category'],
                    'brand' => $row['brand'],
                    'in_stock' => (bool)$row['in_stock'],
                ]);

                $currentProduct->setPrice([
                    'amount' => $row['price_amount'],
                    'symbol' => $row['price_symbol'],
                    'currency' => $row['price_currency']
                ]);

                $currentProductId = $productId;
            }

            if (!empty($row['image_url']) && !in_array($row['image_url'], $gallery)) {
                $gallery[] = $row['image_url'];
            }

        }

        // Add the last product
        if ($currentProduct !== null) {
            $currentProduct->setGallery($gallery);
            $products[] = $currentProduct;
        }

        return $products;
    }
}
