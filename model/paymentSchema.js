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
  payee_address_line_2: Joi.string()
    .optional()
    .allow(null || ""),
  payee_city: Joi.string().required(),
  payee_country: Joi.string().length(2).uppercase().required(),
  payee_province_or_state: Joi.string().optional().allow(null),
  payee_postal_code: Joi.string().required(),
  payee_phone_number: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required(),
  payee_email: Joi.string().email().required(),
  currency: Joi.string().length(3).uppercase().required(),
  discount_percent: Joi.number().min(0).max(100).optional().allow(null),
  tax_percent: Joi.number().min(0).optional().allow(null),
  due_amount: Joi.number().min(0).required(),
  total_due: Joi.number().optional().allow(null),
  evidence_file_id: Joi.string().optional().allow(null),
});

const paymentUpdateSchema = Joi.object({
  payee_payment_status: Joi.string()
    .valid("completed", "due_now", "overdue", "pending")
    .required(),
  evidence_file_id: Joi.string().optional().allow(null),
  payee_due_date: Joi.date().iso().required(),
  due_amount: Joi.number().min(0).required(),
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

module.exports = { paymentSchema, paymentUpdateSchema, userSchema };
