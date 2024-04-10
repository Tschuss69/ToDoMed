<?php
namespace App\Entity\Utilities;

use Symfony\Component\Serializer\Annotation\Groups;

class CCTree {
    public $node;

    /**
     * @var never[]
     */

    public $children;

    public function __construct()
    {
        $this->children = array();
    }
}
