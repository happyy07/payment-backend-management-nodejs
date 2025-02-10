// paymentSchema.js

const Joi = require("joi");

const paymentSchema = Joi.object({
  payee_first_name: Joi.string().required(),
  payee_last_name: Joi.string().required(),
  payee_payment_status: Joi.string()
    .valid("completed", "due_now", "overdue", "pending")
    .required(),
  payee_added_date_utc: Joi.date().iso().required(),
  payee_due_date: Joi.date().iso().required(),
  payee_address_line_1: Joi.string().required(),
  payee_address_line_2: Joi.string().allow(null, ""),
  payee_city: Joi.string().required(),
  payee_country: Joi.string().length(2).required(), // ISO 3166-1 alpha-2
  payee_province_or_state: Joi.string().allow(null, ""),
  payee_postal_code: Joi.string().required(),
  payee_phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(), // E.164 format
  payee_email: Joi.string().email().required(),
  currency: Joi.string().length(3).required(), // ISO 4217
  discount_percent: Joi.number().precision(2).min(0).max(100).allow(null),
  tax_percent: Joi.number().precision(2).min(0).max(100).allow(null),
  due_amount: Joi.number().precision(2).positive().required(),
  total_due: Joi.number().precision(2).positive().required(),
});

module.exports = paymentSchema;
