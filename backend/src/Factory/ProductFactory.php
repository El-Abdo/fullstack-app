<?php

namespace Abdelrahman\Backend\Factory;

use Abdelrahman\Backend\Model\{ClothesProduct, Product, TechProduct};

class ProductFactory
{
    public static function create(array $data): Product
    {
        return match($data['category']) {
            'tech' => new TechProduct(
                $data['id'],
                $data['name'],
                $data['description'],
                $data['category'],
                $data['brand'],
                $data['in_stock']
            ),
            'clothes' => new ClothesProduct(
                $data['id'],
                $data['name'],
                $data['description'],
                $data['category'],
                $data['brand'],
                $data['in_stock']
            ),
            default => throw new \InvalidArgumentException("Unknown category: {$data['category']}")
        };
    }
}
