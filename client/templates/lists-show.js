var EDITING_KEY = 'editingList';
Session.setDefault(EDITING_KEY, false);

Template.listsShow.helpers({
  editing: function() {
    return Session.get(EDITING_KEY);
  },

  todos: function() {
    return Todos.find({listId: this._id}, {sort: {createdAt : -1}});
  }
});

var editList = function(list, template) {
  Session.set(EDITING_KEY, true);
  
  // wait for the template to redraw based on the reactive change
  Tracker.afterFlush(function() {
    template.$('.js-edit-form input[type=text]').focus();
  });
}

var deleteList = function(list, template) {
  // if this is the only visible list, you can't delete it
  if (Lists.find().count() === 1)
    return alert("Sorry, you can't delete your last list. You must have one todo list.");
  
  var message = "Are you sure you want to delete the list " + list.name + "?";
  if (confirm(message)) {
    // we must remove each item individually from the client
    Todos.find({listId: list._id}).forEach(function(todo) {
      Todos.remove(todo._id);
    });
    Lists.remove(list._id);

    Router.go('home');
    return true;
  } else {
    return false;
  }
}

var toggleListPrivacy = function(list, template) {
  if (! Meteor.user())
    throw "Can't change list privacy if not logged in";

  if (list.userId)
    Lists.update(list._id, {$unset: {userId: true}});
  else
    Lists.update(list._id, {$set: {userId: Meteor.userId()}});
}

Template.listsShow.events({
  'click .js-cancel': function() {
    Session.set(EDITING_KEY, false);
  },
  
  'keydown input[type=text]': function(e) {
    // ESC
    if (27 === e.which) {
      e.preventDefault();
      $(e.target).blur();
    }
  },
  
  'blur input[type=text]': function() {
    Session.set(EDITING_KEY, false);
  },

  'submit .js-edit-form': function(e, template) {
    e.preventDefault();

    Lists.update(this._id, {$set: {name: template.$('[name=name]').val()}});
    Session.set(EDITING_KEY, false);
  },

  'change .list-edit': function(e, template) {
    if ($(e.target).val() === 'edit') {
      editList(this, template);
      
    } else if ($(e.target).val() === 'delete') {
      if (! deleteList(this, template)) {
        // reset the select
        e.target.selectedIndex = 0;
      }
    } else {
      toggleListPrivacy(this, template);
    }
  },
  
  'click .js-edit-list': function(e, template) {
    editList(this, template);
  },
  
  'click .js-toggle-list-privacy': function(e, template) {
    toggleListPrivacy(this, template);
  },
  
  'click .js-delete-list': function(e, template) {
    deleteList(this, template);
  },

  'submit .js-todo-new': function(e, template) {
    e.preventDefault();

    var $input = $(e.target).find('[type=text]');
    Todos.insert({
      listId: this._id,
      text: $input.val(),
      checked: false,
      createdAt: new Date
    });
    $input.val('');
  },

  'change [type=checkbox]': function(e) {
    Todos.update(this._id, {$set: {checked: $(e.target).is(':checked')}});
  }
});