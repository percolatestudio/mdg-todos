Router.configure({
  layoutTemplate: 'appBody',
  loadingTemplate: 'appLoading',
  waitOn: function() {
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('privateLists')
    ]
  }
});

Router.map(function() {
  this.route('join');
  this.route('signin');

  this.route('listsShow', {
    path: '/lists/:_id',
    // we don't wait on this, just use it to drive the UI
    onBeforeAction: function() {
      this.todosHandle = Meteor.subscribe('todos', this.params._id);
    },
    data: function() {
      return Lists.findOne(this.params._id);
    }
  });
  
  this.route('home', {
    path: '/',
    action: function() {
      Router.go('listsShow', Lists.findOne());
    }
  })
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
}