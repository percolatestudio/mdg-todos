var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

Template.appBody.helpers({
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
  },
  activeListClass: function() {
    var current = Router.current()
    if (current.route.name === 'listsShow' && current.params._id === this._id)
      return 'active';
  },
  connected: function() {
    return Meteor.status().connected;
  }
});

Template.appBody.events({
  'click [data-menu]': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .content-overlay': function(e) {
    Session.set(MENU_KEY, false);
    e.preventDefault();
  },

  'click [data-user-menu]': function(e) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
    // stop the menu from closing
    e.stopImmediatePropagation();
  },

  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click [data-logout]': function() {
    Meteor.logout();
  },

  'click [data-new-list]': function() {
    // XXX: should this be in collection.js?
    var nextLetter = 'A', nextName = 'List ' + nextLetter;
    while (Lists.findOne({name: nextName})) {
      // not going to be too smart here, can go past Z
      var nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
      nextName = 'List ' + nextLetter;
    }
    var list = {name: nextName};
    list._id = Lists.insert(list);

    // XXX: should we do this async?
    Router.go('listsShow', list);
  }
});