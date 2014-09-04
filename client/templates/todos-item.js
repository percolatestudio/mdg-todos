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
  'focus input[type=text]': function(e) {
    Session.set(EDITING_KEY, this._id);
  },
  
  'blur input[type=text]': function() {
    // XXX: have to do this in a timeout to let the click event below fire. 
    //   is there a better way?
    var self = this;
    Meteor.setTimeout(function() {
      if (Session.equals(EDITING_KEY, self._id))
        Session.set(EDITING_KEY, null);
    }, 200);
  },
  
  'keydown input[type=text]': function(e) {
    // ESC or ENTER
    if (_.include([27, 13], e.which)) {
      e.preventDefault();
      $(e.target).blur();
    }
  },
  
  'keyup input[type=text]': _.throttle(function(e) {
    Todos.update(this._id, {$set: {text: $(e.target).val()}});
  }, 300),
  
  'click [data-delete-item]': function() {
    Todos.remove(this._id);
  }
  
});