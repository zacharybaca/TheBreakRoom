export const paginationMiddleware = (model, queryModifier) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    try {
      const totalDocs = await model.countDocuments().exec();

      if (endIndex < totalDocs) {
        results.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit,
        };
      }

      let query = model.find().limit(limit).skip(startIndex);

      // Apply custom query modifications (like populate/sort) if provided
      if (queryModifier) {
        query = queryModifier(query);
      }

      results.results = await query.exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};
