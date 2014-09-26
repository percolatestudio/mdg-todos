Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);
  
  return Todos.find({listId: listId});
});

Meteor.publish('incompleteTodoCount', function(listId) {
  check(listId, String);
  
  var todos = Todos.find({listId: listId, checked: false});
  Counts.publish(this, listId + '-incomplete-todos', todos);
});