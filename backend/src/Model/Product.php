<?php

namespace Abdelrahman\Backend\Model;

abstract class Product
{
    protected array $price = [];
    protected array $attributes = [];
    protected array $gallery = [];

    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $description,
        public readonly string $category,
        public readonly string $brand,
        public readonly bool $in_stock
    ) {
    }

    public function setPrice(array $price): void
    {
        $this->price = $price;
    }

    public function addAttribute(Attribute $attribute): void
    {
        $this->attributes[] = $attribute;
    }

    public function getFormattedPrice(): string
    {
        return $this->price['symbol'] . number_format($this->price['amount'], 2) . ' ' . $this->price['currency'];
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setGallery(array $gallery): void
    {
        $this->gallery = $gallery;
    }

    public function getGallery(): array
    {
        return $this->gallery;
    }
    abstract public function getType(): string;
}
