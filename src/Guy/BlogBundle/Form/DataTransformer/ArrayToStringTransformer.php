<?php

namespace Guy\BlogBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;

/**
 * Description of ArrayToStringTransformer
 *
 * @author Guillaume Sainthillier <guillaume.sainthillier@gmail.com>
 */
class ArrayToStringTransformer implements DataTransformerInterface {

    /**
     * String -> Array
     * @param string $value
     */
    public function reverseTransform($value) {
	return array_map('trim', explode(',', $value));
    }

    /**
     * Array -> String
     * @param array $value
     */
    public function transform($value) {
	return implode(', ', $value);
    }

}
