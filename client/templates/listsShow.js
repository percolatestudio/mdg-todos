Template.listsShow.helpers({
  todos: function() {
    return Todos.find({listId: this._id});
  }
});