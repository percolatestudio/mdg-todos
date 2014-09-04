var ERRORS_KEY = 'joinErrors';

Template.join.helpers({
  errors: function() {
    return Session.get(ERRORS_KEY);
  }
});

Template.join.events({
  'submit': function(e, template) {
    e.preventDefault();
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();


    var errors = [];
    if (! email)
      errors.push('Email required');
    if (! password)
      errors.push('Password required');
    if (confirm !== password)
      errors.push('Please confirm your password');

    Session.set(ERRORS_KEY, errors);
    if (errors.length)
      return;

    Accounts.createUser({
      email: email,
      password: password
    }, function(error) {
      if (error)
        return Session.set(ERRORS_KEY, [error.reason]);

      Router.go('home');
    });
  }
});