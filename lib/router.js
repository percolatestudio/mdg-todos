Router.configure({
  layoutTemplate: 'appBody',
  loadingTemplate: 'appLoading',
  notFoundTemplate: 'appNotFound',
  waitOn: function() {
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('privateLists')
    ]
  }
});

Router.map(function() {
  // this.route('join');
  this.route('signin');

  this.route('listsShow', {
    path: '/lists/:_id',
    // we don't wait on this, just use it to drive the UI
    onBeforeAction: function() {
      console.log('onBeforeAction running');
      Tracker.onInvalidate(function() {
        console.log('onBeforeAction invalidating')
      });
      this.todosHandle = Meteor.subscribe('todos', this.params._id);
      this.next();
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
  });
  
  this.route('appNotFound', {path: '/*'});
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}