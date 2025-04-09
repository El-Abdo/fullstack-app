<?php

namespace Abdelrahman\Backend\Factory;

use Abdelrahman\Backend\Model\{SwatchAttribute, TextAttribute};

class AttributeFactory
{
    public static function create(array $data, array $items): Attributee
    {
        return match($data['type']) {
            'text' => new TextAttribute($data['id'], $data['name'], $items),
            'swatch' => new SwatchAttribute($data['id'], $data['name'], $items),
            default => throw new \InvalidArgumentException("Unknown attribute type: {$data['type']}")
        };
    }
}
