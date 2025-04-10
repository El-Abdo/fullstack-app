<?php

namespace Abdelrahman\Backend\Controller;

use Abdelrahman\Backend\Repository\ProductRepository;
use GraphQL\GraphQL;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

class GraphQLController
{
    private ProductRepository $repository;

    public function __construct(ProductRepository $repository)
    {
        $this->repository = $repository;
    }

    public function handle(): string
    {
        try {
            $attributeItemType = new ObjectType([
                'name' => 'AttributeItem',
                'fields' => [
                    'displayValue' => ['type' => Type::string()],
                    'value' => ['type' => Type::string()]
                ]
            ]);

            $attributeType = new ObjectType([
                'name' => 'Attribute',
                'fields' => [
                    'id' => ['type' => Type::id()],
                    'name' => ['type' => Type::string()],
                    'type' => [
                        'type' => Type::string(),
                        'resolve' => fn ($attribute) => $attribute->getType()
                    ],
                    'items' => [
                        'type' => Type::listOf($attributeItemType),
                        'resolve' => fn ($attribute) => $attribute->items
                    ]
                ]
            ]);

            $productType = new ObjectType([
                'name' => 'Product',
                'fields' => [
                    'id' => ['type' => Type::nonNull(Type::id())],
                    'name' => ['type' => Type::nonNull(Type::string())],
                    'description' => ['type' => Type::string()],
                    'category' => ['type' => Type::nonNull(Type::string())],
                    'brand' => ['type' => Type::string()],
                    'inStock' => [
                        'type' => Type::boolean(),
                        'resolve' => fn ($product) => $product->in_stock
                    ],
                    'price' => [
                        'type' => Type::string(),
                        'resolve' => fn ($product) => $product->getFormattedPrice()
                    ],
                    'attributes' => [
                        'type' => Type::listOf($attributeType),
                        'resolve' => fn ($product) => $product->getAttributes()
                    ]
                ]
            ]);

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'products' => [
                        'type' => Type::listOf($productType),
                        'args' => [
                            'category' => ['type' => Type::string()],
                            'limit' => ['type' => Type::int()],
                            'offset' => ['type' => Type::int()]
                        ],
                        'resolve' => function ($root, $args) {
                            return $this->repository->findByCategory($args['category'] ?? null);
                        }
                    ]
                ]
            ]);

            $schema = new Schema([
                'query' => $queryType
            ]);

            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? null;
            $variables = $input['variables'] ?? null;

            $result = GraphQL::executeQuery(
                $schema,
                $query,
                null,
                null,
                $variables
            );

            $output = $result->toArray();
        } catch (\Exception $e) {
            $output = [
                'errors' => [
                    [
                        'message' => $e->getMessage(),
                        'extensions' => ['code' => $e->getCode()]
                    ]
                ]
            ];
        }

        header('Content-Type: application/json');
        return json_encode($output);
    }
}
