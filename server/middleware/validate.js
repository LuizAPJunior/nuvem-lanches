const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return res.status(400).json({
      error: 'Dados inválidos',
      issues: result.error.flatten().fieldErrors,
    });
  }

  // Replace with parsed, coerced and defaulted data
  req[source] = result.data;
  next();
};

module.exports = validate;