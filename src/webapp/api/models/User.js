module.exports = {
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },

    email: {
      type: 'string',
      required: true
    },

    password: {
      type: 'string',
      required: true
    },

    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    }
  }
};
