Template.join.events({
  'submit': function(e, template) {
    e.preventDefault();
    // XXX: check arguments
    
    Accounts.createUser({
      email: template.$('[name=email]').val(),
      password: template.$('[name=password]').val()
    }, function() {
      // XXX: errors
      Router.go('home');
    });
  }
});