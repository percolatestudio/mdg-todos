var ERRORS_KEY = 'signinErrors';

Template.signin.helpers({
  errors: function() {
    return Session.get(ERRORS_KEY);
  }
});

Template.signin.events({
  'submit': function(e, template) {
    e.preventDefault();
    
    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();
    
    var errors = [];
    if (! email)
      errors.push('Email is required');
    if (! password)
      errors.push('Password is required');
    
    Session.set(ERRORS_KEY, errors);
    if (errors.length)
      return;
    
    Meteor.loginWithPassword(email, password, function(error) {
      if (error)
        return Session.set(ERRORS_KEY, [error.reason]);
      
      Router.go('home');
    });
  }
})