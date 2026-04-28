export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict Error',
      message: 'A unique constraint would be violated.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Record not found.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
};
