const constraints = {
    first_name: {
      presence: {allowEmpty: false},
    },
    middle_initial: {
      length: {
        maximum: 1,
        message: " must be 1 character maximum"
      }
    },
    last_name: {
      presence: {allowEmpty: true},
    },
    email_address: {
      presence: {allowEmpty: false},
      email: true,
    },
  };
  
  export default constraints;