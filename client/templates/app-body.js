var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

Template.appBody.rendered = function() {
  this.hammer = new Hammer(this.$('#container'));
  this.hammer.on('swipeleft swiperight', function(event) {
    if (event.gesture.direction === 'right')
      Session.set(MENU_KEY, true);
    else if (event.gesture.direction === 'left')
      Session.set(MENU_KEY, false);
  });
}

Template.appBody.destroyed = function() {
  this.hammer.destroy();
}

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
  'click .js-menu': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .content-overlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click .js-user-menu': function(event) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click .js-logout': function() {
    Meteor.logout();
    
    // if we are on a private list, we'll need to go to a public one
    var current = Router.current();
    if (current.route.name === 'listsShow' && current.data().userId)
      Router.go('listsShow', Lists.findOne({userId: {$exists: false}}));
  },

  'click .js-new-list': function() {
    var list = {name: Lists.defaultName(), incompleteCount: 0};
    list._id = Lists.insert(list);

    Router.go('listsShow', list);
  }
});