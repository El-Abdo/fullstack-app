<?php

namespace Abdelrahman\Backend\Model;

abstract class Attribute
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly array $items
    ) {
    }

    abstract public function getType(): string;
}
