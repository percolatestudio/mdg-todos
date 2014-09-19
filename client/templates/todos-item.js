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
  'focus input[type=text]': function(event) {
    Session.set(EDITING_KEY, this._id);
  },
  
  'blur input[type=text]': function(event) {
    if (Session.equals(EDITING_KEY, this._id))
      Session.set(EDITING_KEY, null);
  },
  
  'keydown input[type=text]': function(event) {
    // ESC or ENTER
    if (_.include([27, 13], event.which)) {
      event.preventDefault();
      $(event.target).blur();
    }
  },
  
  'keyup input[type=text]': _.throttle(function(event) {
    Todos.update(this._id, {$set: {text: $(event.target).val()}});
  }, 300),
  
  // handle mousedown instead of click so we don't conflict with the above blur
  'mousedown .js-delete-item': function() {
    Todos.remove(this._id);
  }
  
});