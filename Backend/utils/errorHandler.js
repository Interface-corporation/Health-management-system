export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
};
