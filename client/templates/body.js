var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

Template.body.helpers({
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  email: function() {
    return Meteor.user().emails[0].address;
  },
  userMenuOpen: function() {
    return Session.get(USER_MENU_KEY);
  },
  lists: function() {
    return Lists.find();
  }
});

Template.body.events({
  'click [data-menu]': function(e) {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },
  
  'click [data-user-menu]': function(e) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
  },
  
  'click [data-logout]': function(e) {
    Meteor.logout();
  }
});