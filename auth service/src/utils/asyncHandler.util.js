const asyncHandler = (fn) => (req, req, res) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;
