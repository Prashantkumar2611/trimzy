const validate = (schema) => (req, res, next) => {
  try {
    // parse strips unknown fields if we don't use passthrough(), but we want to prevent pollution
    // and validate types stringently.
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
      details: error.errors
    });
  }
};

module.exports = { validate };
