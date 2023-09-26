<?php

namespace Eminos\StatamicElementPicker;

use Statamic\Providers\AddonServiceProvider;
use Eminos\StatamicElementPicker\Fieldtypes\ElementPickerFieldtype;
 
class ServiceProvider extends AddonServiceProvider
{
    public function __construct()
    {
        $this->vite['hotFile'] = base_path('vendor/eminos/statamic-element-picker/dist/vite.hot');

        parent::__construct(app());
    }

    protected $fieldtypes = [
        ElementPickerFieldtype::class,
    ];

    protected $vite = [
        'hotFile' => null, // set in the constructor for reasons
        'publicDirectory' => 'dist',
        'input' => [
            'resources/js/statamic-element-picker.js',
            'resources/css/statamic-element-picker.css'
        ],
    ];

    public function bootAddon()
    {

        // 
        
    }
}