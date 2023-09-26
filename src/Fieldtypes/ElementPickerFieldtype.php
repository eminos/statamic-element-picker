<?php

namespace Eminos\StatamicElementPicker\Fieldtypes;

use Statamic\Fields\Fieldtype;

class ElementPickerFieldtype extends Fieldtype
{
    // protected $icon = 'tour';

    /**
     * The blank/default value.
     *
     * @return array
     */
    public function defaultValue()
    {
        return null;
    }

    /**
     * Pre-process the data before it gets sent to the publish page.
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function preProcess($data)
    {
        return $data;
    }

    /**
     * Process the data before it gets saved.
     *
     * @param mixed $data
     * @return array|mixed
     */
    public function process($data)
    {
        return $data;
    }

    protected function configFieldItems(): array
    {
        return [
            'url_source' => [
                'display' => 'URL Source',
                'instructions' => 'Where should the URL come from?',
                'type' => 'radio',
                'width' => 50,
                'default' => '',
                'options' => [
                    '' => 'No URL. Just open the element picker right there.',
                    'field_config' => 'Set it right here.',
                    'sibling_or_ancestor' => 'A sibling or ancestor field.',
                ],
            ],
            'url' => [
                'display' => 'URL',
                'instructions' => 'The URL to open when picking an element.<br>Keep in mind that this URL has to be the same origin as the control panel.',
                'type' => 'text',
                'width' => 50,
                'default' => '',
                'if' => [
                    'url_source' => 'field_config',
                ],
            ],
            'url_field_handle' => [
                'display' => 'URL Field Handle',
                'instructions' => 'The handle of a sibling or ancestor field that contains the URL to open when picking an element.',
                'type' => 'text',
                'width' => 50,
                'default' => '',
                'if' => [
                    'url_source' => 'sibling_or_ancestor',
                ],
            ],
        ];
    }
}
