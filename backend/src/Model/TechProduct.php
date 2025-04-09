<?php

namespace Abdelrahman\Backend\Model;

class TechProduct extends Product
{
    public function getType(): string
    {
        return 'tech';
    }
}
