Lark = {
  init: function(){
    var loaded = false;

    Lark.preload_pages(['login','mail','contacts'], function(name, finished){
      loaded = finished;
    });

    while(!loaded){}
  },


  cache: {
    pages: {},
    emails: {}
  },


  display_page: function(page){
    Lark.elmt.content.html(Lark.cache.pages[page]);
  },


  elmt: {
    content: $("#page_content")
  },


  get_data: function(path, callback){
    $.get(path, function(data){
      callback(data);
    })
    .error(function(){
      alert("Could not load "+path);
    });
  },


  load_state: function(){
    // Retrieve state from cookie
    // Display appropriate page
  },


  login: function(username, password, callback){
  },


  logout: function(callback){
    // Erase cookie
    // Reload html page
  },


  preload_pages: function(pages, callback){
    var loaded = 0;

    for(var i=0; i < pages.lenth; i++){
      Lark.get_data('pages/' + pages[i] + '.html', function(data){
        Lark.cache.pages[pages[i]] = data;
        loaded++;
        callback(pages[i], loaded === pages.length);
      });
    }
  },


  session: false
}


Lark.Mail = {
  fetch: function(callback){
  },


  compose: function(){
  },


  send: function(email, callback){
  },


  search: function(query, callback){
  }
}


Lark.MailService = new Function();
