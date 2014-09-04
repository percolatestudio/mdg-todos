var EDITING_KEY = 'EDITING_TODO_ID';

Template.todosItem.helpers({
  checkedClass: function() {
    return this.checked && 'checked';
  },
  editingClass: function() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  }
});

Template.todosItem.events({
  // XXX: alternatively, could just set the class via jQ directly, which might
  //  be conceptually simpler
  'focus input[type=text]': function() {
    Session.set(EDITING_KEY, this._id);
  },
  
  'blur input[type=text]': function() {
    Session.set(EDITING_KEY, null);
  }
});