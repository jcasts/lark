Lark = {
  init: function(){
    var loaded = false;

    Lark.View.preload(function(name, finished){
      loaded = finished;
    });

    // Get session from cookie

    while(!loaded){}
  },


  error: function(message){
    logger.error(message);
  },


  // Make a request to the API
  request: function(verb, path, data, callback){
    if(Lark.session) data.session = Lark.session;

    var req = $.ajax({
      url:  path,
      type: verb,
      data: data,

      statusCode: {
        200: function(data){
          eval("var data = " + data);
          callback(data);
        }

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
      callback(data);
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
      callback(data);
    })
    .error(function(){
      Lark.error("Could not logout");
    });
  },


  session: false
}


Lark.View = {

  cache: {
    pages: {},
  },


  page_names: ['login','mail','contacts','settings'],


  elmt: {
    content: $("#page_content")
  },


  display_page: function(page){
    Lark.View.elmt.content.html(Lark.View.cache.pages[page]);
  },


  preload_pages: function(callback){
    var loaded = 0;
    var pages  = Lark.View.page_names;

    for(var i=0; i < pages.lenth; i++){
      $.get('pages/' + pages[i] + '.html', function(data){
        Lark.View.cache.pages[pages[i]] = data;
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


  // Saves View state to local storage
  save_state: function(){
  }
}


Lark.Contact = {

  // Create a new contact. Supports attributes:
  //  name:   contact name
  //  emails: list of emails for that person
  //  tags:   tag that person!
  create: function(attribs, callback){
    return Lark.request("post", "/contact", attribs, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to create contact");
    });
  },


  // Delete a contact. Requires a contact id.
  delete: function(id, callback){
    return Lark.request("delete", "/contact/"+id, {}, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to delete contact");
    });
  },


  // Update a contact. Supports create attributes and requires a contact id.
  update: function(id, attribs, callback){
    return Lark.request("put", "/contact/"+id, attribs, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to update contact");
    });
  },


  // Read and return the contact by its id.
  get: function(id, callback){
    return Lark.request("get", "/contact/"+id, {}, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to retrieve contact");
    });
  }


  // Get a list of contacts. Supports query params:
  //  count:    number to fetch
  //  start:    start index
  //  filters:  filter list to apply during retrieval
  //    terms:    search terms
  //    fields:   fields to search: name, emails, tags
  list: function(query, callback){
    return Lark.request("get", "/contact", query, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to get contacts");
    });
  },
}


Lark.Mail = {

  receive: function(callback){
    return Lark.request("get", "/popmail", {}, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to receive POP email");
    });
  },


  send: function(email, callback){
    return Lark.request("post", "/email", email, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to send email");
    });
  },


  // Read and return the email by its id.
  get: function(id, callback){
    return Lark.request("get", "/email/"+id, {}, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to retrieve email");
    });
  },


  // Delete an email. Requires an email id.
  delete: function(id, callback){
    return Lark.request("delete", "/email/"+id, {}, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to delete contact");
    });
  },


  // Update an email thread. Requires an email id and supports these attributes:
  //  tags:   a list of tags for the email
  //  folder: the folder this email should live in (inbox, archive, spam, trash)
  update: function(id, attribs, callback){
    return Lark.request("put", "/contact/"+id, attribs, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to update email");
    });
  },


  // Get a list of emails. Supports query params:
  //  count:    number to fetch
  //  start:    start index
  //  filters:  filter list to apply during retrieval
  //    terms:    search terms
  //    fields:   fields to search: body, subject, sender, tags, date
  //  folders:  name of the folder to search (inbox, archive, spam, trash, all)
  list: function(query, callback){
    return Lark.request("get", "/email", query, function(data){
      callback(data);
    })
    .error(function(){
      Lark.error("Failed to read email");
    });
  },


  accounts: []
}
