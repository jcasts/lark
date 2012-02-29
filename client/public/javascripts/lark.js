Lark = {
  init: function(){
    var loaded = false;

    Lark.GUI.preload(function(name, finished){
      loaded = finished;
    });

    // Get session from cookie

    while(!loaded){}
  },


  error: function(message){
  },


  // Make a request to the API
  request: function(verb, path, data, callback){
    if(Lark.session) data.session = Lark.session;

    var req = $.ajax({
      url:  path,
      type: verb,
      data: data,

      statusCode: {
        200: callback;

        400: function(){
          Lark.error("Invalid client request");
        },

        403: function(){
          Lark.error("Authentication failed");
        }

        404: function(){
          Lark.error("Invalid client request");
        },

        500: function(){
          Lark.error("Server Error");
        }
      }
    });

    return req;
  },


  login: function(username, password, callback){
    var data = {username: username, password: password};

    return Lark.request("post", "/session", data, function(data){
      // Set cookie
      callback();
    })
    .error(function(){
      Lark.error("Invalid login");
    });
  },


  logout: function(callback){
    if(!Lark.session) return;

    return Lark.request("delete", "/session/"+Lark.session, {}, function(data){
      // Erase cookie
      // Reload html page
      callback();
    })
    .error(function(){
      Lark.error("Could not logout");
    });
  },


  session: false
}


Lark.GUI = {

  cache: {
    pages: {},
  },


  page_names: ['login','mail','contacts','settings'],


  elmt: {
    content: $("#page_content")
  },


  display_page: function(page){
    Lark.GUI.elmt.content.html(Lark.GUI.cache.pages[page]);
  },


  preload_pages: function(callback){
    var loaded = 0;
    var pages  = Lark.GUI.page_names;

    for(var i=0; i < pages.lenth; i++){
      $.get('pages/' + pages[i] + '.html', function(data){
        Lark.GUI.cache.pages[pages[i]] = data;
        loaded++;
        callback(pages[i], loaded === pages.length);
      })
      .error(function(){
        Lark.error("Could not load page "+pages[i]);
      });
    }
  },


  // Loads a marshalled state
  load_state: function(){
  },


  // Saves GUI state to local storage
  save_state: function(){
  }
}


Lark.Mail = {

  cache: {
    emails: {}
  },


  compose: function(){
  },


  receive: function(callback){
  },


  send: function(email, callback){
  },


  // Get a list of emails. Supports query params:
  //  count:    number to fetch
  //  start:    start index
  //  filters:  filter list to apply during retrieval
  //    terms:    search terms
  //    fields:   fields to search: body, subject, sender
  list: function(query, callback){
  },


  accounts: []
}
