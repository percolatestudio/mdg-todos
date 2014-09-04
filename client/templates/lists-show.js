var EDITING_KEY = 'editingList';
// XXX: do this in route load?
Session.setDefault(EDITING_KEY, false);

Template.listsShow.helpers({
  editing: function() {
    return Session.get(EDITING_KEY);
  },

  todos: function() {
    return Todos.find({listId: this._id});
  }
});

Template.listsShow.events({
  'click [data-cancel]': function() {
    Session.set(EDITING_KEY, false);
  },

  'submit .list-edit-form': function(e, template) {
    e.preventDefault();

    Lists.update(this._id, {$set: {name: template.$('[name=name]').val()}});
    Session.set(EDITING_KEY, false);
  },

  'change .list-edit': function(e) {
    if ($(e.target).val() === 'edit') {
      Session.set(EDITING_KEY, true);
    } else if ($(e.target).val() === 'delete') {
      var message = "Are you sure you want to delete the list " + this.name + "?";
      if (confirm(message)) {
        // XXX: probably use a method for this
        Todos.find({listId: this._id}).forEach(function(todo) {
          Todos.remove(todo._id);
        });
        Lists.remove(this._id);
        Router.go('home');
      }
    } else {
      if (! Meteor.user())
        throw "Can't change list privacy if not logged in";

      if (this.userId)
        Lists.update(this._id, {$unset: {userId: true}});
      else
        Lists.update(this._id, {$set: {userId: Meteor.userId()}});
    }
  },

  'submit [data-todo-new]': function(e, template) {
    e.preventDefault();

    var $input = $(e.target).find('[type=text]');
    Todos.insert({
      listId: this._id,
      text: $input.val(),
      checked: false
    });
    $input.val('');
  },

  'change [type=checkbox]': function(e) {
    Todos.update(this._id, {$set: {checked: $(e.target).is(':checked')}});
  }
});