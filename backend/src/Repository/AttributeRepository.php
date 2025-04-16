<?php

namespace Abdelrahman\Backend\Repository;

use Abdelrahman\Backend\Factory\AttributeFactory;
use Abdelrahman\Backend\Model\AttributeItem;

class AttributeRepository
{
    public function __construct(private \PDO $connection)
    {
    }

    public function findByProductId(int $productId): array
    {
        $sql = "SELECT a.id, a.name, a.type, 
                ai.display_value, ai.value, ai.id as item_id
                FROM attributes a
                JOIN attribute_items ai ON a.id = ai.attribute_id
                WHERE a.product_id = ?
                ORDER BY a.id, ai.id";

        $stmt = $this->connection->prepare($sql);
        $stmt->execute([$productId]);

        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return $this->hydrateAttributes($rows);
    }

    private function hydrateAttributes(array $rows): array
    {
        $attributes = [];
        $currentAttributeId = null;
        $currentItems = [];
        $currentData = [];

        foreach ($rows as $row) {
            if ($currentAttributeId !== $row['id']) {
                if ($currentData) {
                    $attributes[] = AttributeFactory::create($currentData, $currentItems);
                }

                $currentAttributeId = $row['id'];
                $currentData = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'type' => $row['type']
                ];
                $currentItems = [];
            }

            $currentItems[] = new AttributeItem(
                $row['item_id'],
                $row['display_value'],
                $row['value']
            );
        }

        if ($currentData) {
            $attributes[] = AttributeFactory::create($currentData, $currentItems);
        }

        return $attributes;
    }

}
