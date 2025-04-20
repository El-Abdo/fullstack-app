<?php

namespace Abdelrahman\Backend\Controller;

use Abdelrahman\Backend\Repository\ProductRepository;
use Abdelrahman\Backend\Service\OrderService;
use GraphQL\GraphQL;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

class GraphQLController
{
    private ProductRepository $repository;
    private OrderService $orderService;

    public function __construct(ProductRepository $repository, OrderService $orderService)
    {
        $this->repository = $repository;
        $this->orderService = $orderService;
    }

    public function handle(): string
    {
        try {
            $attributeItemType = new ObjectType([
                'name' => 'AttributeItem',
                'fields' => [
                    'id' => ['type' => Type::id()],
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

            $priceType = new ObjectType([
                'name' => 'Price',
                'fields' => [
                    'amount' => ['type' => Type::nonNull(Type::float())],
                    'currency' => ['type' => Type::nonNull(Type::string())],
                    'symbol' => ['type' => Type::nonNull(Type::string())]
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
                        'type' => $priceType,
                        'resolve' => fn ($product) => $product->getPrice()
                    ],
                    'gallery' => [
                        'type' => Type::listOf(Type::string()),
                        'resolve' => fn ($product) => $product->getGallery()
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


            $orderAttributeInputType = new InputObjectType([
                'name' => 'OrderAttributeInput',
                'fields' => [
                    'attribute_id' => ['type' => Type::nonNull(Type::id())],
                    'attribute_item_id' => ['type' => Type::nonNull(Type::id())]
                ]
            ]);

            $createOrderInputType = new InputObjectType([
                'name' => 'CreateOrderInput',
                'fields' => [
                    'product_id' => ['type' => Type::nonNull(Type::id())],
                    'attributes' => ['type' => Type::nonNull(Type::listOf($orderAttributeInputType))],
                    'quantity' => ['type' => Type::nonNull(Type::int())]
                ]
            ]);

            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'createOrder' => [
                        'type' => Type::boolean(),
                        'args' => [
                            'input' => ['type' => Type::nonNull(Type::listOf(Type::nonNull($createOrderInputType)))]
                        ],
                        'resolve' => function ($root, $args) {
                            $items = [];

                            foreach ($args['input'] as $input) {
                                foreach ($input['attributes'] as $attr) {
                                    $items[] = [
                                        'product_id' => $input['product_id'],
                                        'attribute_id' => $attr['attribute_id'],
                                        'attribute_item_id' => $attr['attribute_item_id'],
                                        'quantity' => $input['quantity']
                                    ];
                                }
                            }

                            $this->orderService->createOrder(['items' => $items]);
                            return true;
                        }

                    ]
                ]

            ]);

            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType
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
