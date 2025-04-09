<?php

namespace Abdelrahman\Backend\Factory;

use Abdelrahman\Backend\Model\{Attribute, SwatchAttribute, TextAttribute};

class AttributeFactory
{
    public static function create(array $data, array $items): Attribute
    {
        return match($data['type']) {
            'text' => new TextAttribute($data['id'], $data['name'], $items),
            'swatch' => new SwatchAttribute($data['id'], $data['name'], $items),
            default => throw new \InvalidArgumentException("Unknown attribute type: {$data['type']}")
        };
    }
}
