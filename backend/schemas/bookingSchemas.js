const { z } = require('zod');

const createBookingSchema = z.object({
  barberId: z.string({
    required_error: "Barber ID is required",
    invalid_type_error: "Barber ID must be a string"
  }).min(1, "Barber ID cannot be empty"),
  
  serviceName: z.string({
    required_error: "Service name is required",
    invalid_type_error: "Service name must be a string"
  }).min(1, "Service name cannot be empty"),
  
  mode: z.enum(['shop', 'home'], {
    required_error: "Mode is required",
    invalid_type_error: "Mode must be 'shop' or 'home'"
  }),
  
  scheduledAt: z.string({
    required_error: "Scheduled date is required",
    invalid_type_error: "Scheduled date must be a string"
  }).min(1, "Scheduled date cannot be empty"),
  
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  address: z.string().optional()
});

module.exports = {
  createBookingSchema
};
