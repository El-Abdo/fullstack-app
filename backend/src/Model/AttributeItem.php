<?php

namespace Abdelrahman\Backend\Model;

class AttributeItem
{
    public function __construct(
        public readonly string $displayValue,
        public readonly string $value
    ) {
    }
}
