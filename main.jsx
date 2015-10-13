if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render( <Routes />, document.getElementById("render-target"));
  });


}

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("boards", function () {
    // todo limit to 10 latest
    return BoardsCollection.find({
      /*$or: [
       { private: {$ne: true} },
       { owner: this.userId }
       ]*/
    });
  });

  Meteor.publish("myBoards", function () {
    return BoardsCollection.findAll({
      owner: this.userId
    });
  });

  Meteor.publish("board", function (id) {
    return BoardsCollection.find(id);
  });
}

function slugify(text)
{
  return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
}


Meteor.methods({
  addBoard(name) {
  // Make sure the user is logged in before inserting a task
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }

  var slug = slugify(name);

  var cnt = BoardsCollection.find({slug:slug}).count();
  if(cnt){
    throw new Meteor.Error("board-exists");
  }

  return BoardsCollection.insert({
    slug:slug,
    phrases:[],
    flags:[],
    name:name,
    createdAt: new Date(),
    owner: Meteor.userId(),
    user: Meteor.user()
  });
},

addFlag(boardId,flagId) {

  BoardsCollection.update(boardId,{
    flags: {$push:flagId}
  });
},

removeBoard(boardId) {
  BoardsCollection.remove(boardId);

},

myBoards(){
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }
  return BoardsCollection.findAll({
    owner: Meteor.userId()
  });
},

addPhrase(boardId,text,drink,alcohol) {
  // Make sure the user is logged in before inserting a task

  if (! Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }

  if(isNaN(alcohol)){
    throw new Meteor.Error("bad-request");
  }

  var slug = slugify(text);


  var phrase = {message:text,drink:drink,shots:[],createdAt: new Date(),slug:slug,alcohol:alcohol};

  BoardsCollection.update(boardId,{
    $push: {phrases:phrase}
  });

  return phrase;
},

getBoard(boardId){
  var board = BoardsCollection.findOne(boardId);

  if (board.owner !== Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }
  return board;
},

removePhrase(boardId,slug) {

  BoardsCollection.update(boardId,{$pull:{phrases:{slug:slug}}});
},

addShot(boardId,slug) {
  BoardsCollection.update({_id:boardId,'phrases':{$elemMatch:{slug:slug}}},
      {
    $push: {'phrases.$.shots':{createdAt: new Date()}}
  });
},

removeShot(boardId,slug) {
  BoardsCollection.update({_id:boardId,'phrases':{$elemMatch:{slug:slug}}},
      {
    $pop: {'phrases.$.shots':1}
  });
},

orderPhrase(boardId,slug,newIndex) {
  const board = BoardsCollection.findOne(boardId);
  // TODO
  //board.update({
  // phrases: {$remove:{slug:slug}}
  //});
}
});