import ElementPickerFieldtype from './compontents/ElementPickerFieldtype.vue';

Statamic.booting(() => {
    Statamic.$components.register('element_picker-fieldtype', ElementPickerFieldtype);
});
