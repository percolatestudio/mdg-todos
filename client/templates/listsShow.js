var EDITING_KEY = 'editingList';
// XXX: do this in route load?
Session.setDefault(EDITING_KEY, false);

Template.listsShow.helpers({
  editing: function() {
    return Session.get(EDITING_KEY);
  },

  todos: function() {
    return Todos.find({listId: this._id});
  },

  checkedClass: function() {
    return this.checked && 'checked';
  }
});

Template.listsShow.events({
  'click [data-cancel]': function() {
    Session.set(EDITING_KEY, false);
  },

  'submit [name=edit-list-form]': function(e, template) {
    e.preventDefault();

    Lists.update(this._id, {$set: {name: template.$('[name=name]').val()}});
    Session.set(EDITING_KEY, false);
  },

  'change [name=edit-list]': function(e) {
    if ($(e.target).val() === 'edit') {
      Session.set(EDITING_KEY, true);
    } else if ($(e.target).val() === 'delete') {
      Lists.remove(this._id);
      // XXX: remove Todos too
      Router.go('home');
    } else {
      if (! Meteor.user())
        throw "Can't change list privacy if not logged in";

      if (this.userId)
        Lists.update(this._id, {$unset: {userId: true}});
      else
        Lists.update(this._id, {$set: {userId: Meteor.userId()}});
    }
  },

  'submit [name=new-todo-form]': function(e, template) {
    e.preventDefault();

    Todos.insert({
      listId: this._id,
      text: template.$('[type=text]').val(),
      checked: false
    });
    template.$('[type=text]').val('');
  },

  'change [type=checkbox]': function(e) {
    Todos.update(this._id, {$set: {checked: $(e.target).is(':checked')}});
  }
});