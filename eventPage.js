console.log( "script load" );


//Whenever a page is loaded, 
//
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  //Examine the current window
  //
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	  console.log(tabs[0].url)
    //If batoto is in the window
    //
    if(tabs[0].url.indexOf("batoto") > 0 ){
      var urlMap
      //Get the bookmarks from storage
      //
      chrome.storage.local.get("mangaBookmark",function(storage){
        console.log(storage)
        urlMap = storage.mangaBookmark
        //If it doesn't exist, create an empty one
        //          
        if(!urlMap){
          urlMap = {};
        } 
        //Get the title             
        //
        var fullTitle = tabs[0].title        
        var mangaTitle = fullTitle.split("-")[0]
        //If batoto is not in the url save it
        //
        if(mangaTitle.indexOf("www.batoto") < 0){
          //Save the new link
          //
          urlMap[mangaTitle] = tabs[0].url 
          console.log(urlMap[mangaTitle])
          //Save our bookmarks
          //
          chrome.storage.local.set({'mangaBookmark': urlMap}, function() {
            chrome.storage.local.get("mangaBookmark",function(storage){
              console.log("post save")
              console.log(storage)
            });                  
          });    
        }            
      });          
    }      
  });
})