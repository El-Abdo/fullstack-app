<?php

namespace Abdelrahman\Backend\Model;

class ClothesProduct extends Product
{
    public function getType(): string
    {
        return 'clothes';
    }
}
