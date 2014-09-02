Template.signin.events({
  'submit': function(e, template) {
    e.preventDefault();
    // XXX: check arguments
    
    Meteor.loginWithPassword(
      template.$('[name=email]').val(),
      template.$('[name=password]').val(), 
      function() {
        // XXX: errors
        Router.go('home');
      });
    
  }
})