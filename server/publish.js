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
  console.log('todos', listId)
  this.onStop(function() {
    console.log('unsub todos', listId)
  })
  check(listId, String);
  
  return Todos.find({listId: listId});
});