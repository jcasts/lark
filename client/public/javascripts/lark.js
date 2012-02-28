Lark = {
  init: function(){
    var loaded = false;

    Lark.GUI.preload(function(name, finished){
      loaded = finished;
    });

    // Get session from cookie

    while(!loaded){}
  },


  // Make a request to the API
  request: function(verb, path, data, callback){
    var req = $.ajax({
      url:  path,
      type: verb,

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

    var data = {session: Lark.session}
    return Lark.request("delete", "/session", data, function(data){
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


  fetch: function(callback){
  },


  compose: function(){
  },


  send: function(email, callback){
  },


  search: function(query, callback){
  },


  services: []
}
