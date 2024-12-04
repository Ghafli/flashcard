import Joi from 'joi';

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Deck validation schemas
export const deckSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).allow(''),
    isPublic: Joi.boolean().default(false),
    tags: Joi.array().items(Joi.string().max(30)).max(10)
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100),
    description: Joi.string().max(500).allow(''),
    isPublic: Joi.boolean(),
    tags: Joi.array().items(Joi.string().max(30)).max(10)
  })
};

// Flashcard validation schemas
export const flashcardSchemas = {
  create: Joi.object({
    deckId: Joi.string().required(),
    front: Joi.string().min(1).max(1000).required(),
    back: Joi.string().min(1).max(1000).required(),
    tags: Joi.array().items(Joi.string().max(30)).max(10)
  }),

  update: Joi.object({
    front: Joi.string().min(1).max(1000),
    back: Joi.string().min(1).max(1000),
    tags: Joi.array().items(Joi.string().max(30)).max(10)
  })
};

// Study session validation schemas
export const studySessionSchemas = {
  start: Joi.object({
    deckId: Joi.string().required(),
    cardLimit: Joi.number().integer().min(1).max(100).default(20)
  }),

  complete: Joi.object({
    results: Joi.array().items(
      Joi.object({
        cardId: Joi.string().required(),
        performance: Joi.number().integer().min(1).max(5).required(),
        timeSpent: Joi.number().integer().min(0).required()
      })
    ).min(1).required()
  })
};

// Query parameter validation schemas
export const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  }),

  sorting: Joi.object({
    sort: Joi.string().valid('created', 'updated', 'name', 'difficulty'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Generic validation function
export const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    throw {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details
    };
  }

  return value;
};

// Middleware factory for request validation
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const validated = validate(schema, req[source]);
      req[source] = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};
