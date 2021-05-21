const _ = require('lodash');
const empty = require('is-empty');

module.exports = {
    clean: clean,
    validate: validate,
    validateIgnoreMissing: (data, form) => {
        return validate(data, form, true);
    }
};

/* TODO: Add more rules for basic validations here. */

/**
 * Remove unwanted fields from input that are
 * not specified in the form.
 */
function clean(data, form) {
    let formData = {};
    Object.keys(form.fields).forEach((key) => {
        if (empty(data[key])) {
            return;
        }
        formData[key] = data[key];
    });
    return formData;
}

/**
 * Validate input based on given form rules.
 */
function validate(data, form, ignoreMissing = false) {
    /* Sanity check*/
    if (empty(data)) {
        throw new Error('Data is required.');
    }
    if (empty(form)) {
        throw new Error('A Form is required.');
    }
    if (empty(form.fields)) {
        throw new Error('Form fields are required.');
    }
    if (empty(form.name)) {
        throw new Error('Model name is required.');
    }

    /* Get only data defined in the form */
    let formData = {};
    Object.keys(form.fields).forEach((key) => {
        if (ignoreMissing && empty(data[key])) {
            return;
        }
        formData[key] = data[key];
    });

    /* Validate the basic attributes. */
    let errors = [];
    Object.keys(formData).forEach((key) => {
        const formField = form.fields[key];
        const value = data[key];
        errors[key] = [];

        if (!satisfyRequired(formField, value)) {
            errors[key].push(
                sails.__(buildErrorKey(form.name, key, 'required'))
            );
            return; // data is empty so don't check other attributes.
        }

        if (!satisfyMinLength(formField, value)) {
            errors[key].push(
                sails.__(
                    buildErrorKey(form.name, key, 'minLength'),
                    formField.minLength
                )
            );
        }

        if (!satisfyMaxLength(formField, value)) {
            errors[key].push(
                sails.__(
                    buildErrorKey(form.name, key, 'maxLength'),
                    formField.maxLength
                )
            );
        }

        if (!satisfyRegex(formField, value)) {
            errors[key].push(sails.__(buildErrorKey(form.name, key, 'regex')));
        }
    });

    /* Remove empty errors and return */
    return _.omitBy(errors, (k, i) => {
        return empty(errors[i]);
    });
}

/**
 * Builds the error key string. E.g:
 * "Validations.User.username.required"
 */
function buildErrorKey(modelName, fieldName, attributeName) {
    return 'Validations.' + modelName + '.' + fieldName + '.' + attributeName;
}

/**
 * Checks rule if attribute is required.
 */
function satisfyRequired(field, data) {
    if (empty(field.required) || !field.required) {
        return true;
    }

    // `is-empty` considers 0 as empty but it should be valid in this scenario
    return data === 0 ? true : !empty(data);
}

/**
 *  Check for min length if data is string.
 */
function satisfyMinLength(field, data) {
    if (empty(field.minLength)) {
        return true;
    }
    if (typeof field.minLength !== 'number') {
        throw new Error('Min length should be a number.');
    }
    if (typeof data !== 'string') {
        throw new Error('Input should be of string type.');
    }
    return data.length >= field.minLength;
}

/**
 *  Check for max length if data is string.
 */
function satisfyMaxLength(field, data) {
    if (empty(field.maxLength)) {
        return true;
    }
    if (typeof field.maxLength !== 'number') {
        throw new Error('Max length should be a number.');
    }
    if (typeof data !== 'string') {
        throw new Error('Input should be of string type.');
    }
    return data.length <= field.maxLength;
}

/**
 * Apply a regex check on a given data.
 */
function satisfyRegex(field, data) {
    if (empty(field.regex)) {
        return true;
    }
    // We copy regex to avoid race condition
    const regex = _.clone(field.regex);

    return regex.test(data);
}
