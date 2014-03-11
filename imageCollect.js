// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The onClicked callback function.
function onClickHandler(info, tab) {

    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
    if(info.menuItemId == "copy"){
      var text = info.srcUrl
      console.log("copying")
       var copyDiv = document.createElement('div');
      copyDiv.contentEditable = true;
      document.body.appendChild(copyDiv);
      copyDiv.innerHTML = text;
      copyDiv.unselectable = "off";
      copyDiv.focus();
      document.execCommand('SelectAll');
      document.execCommand("Copy", false, null);
      document.body.removeChild(copyDiv);
    }
    else{
      console.log("saving")
    chrome.storage.local.get("imageKeeper",function(storage){
      console.log("post save")
      console.log(storage)
      urlMap = storage.imageKeeper
      if(!urlMap){
        urlMap = [];
      } 
      urlMap.push(info.srcUrl);   
      chrome.storage.local.set({'imageKeeper': urlMap}, function() {
                   
      }); 
    });     
    }
      
  };

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "image"
  var menuOption = "Save Image"
  var id = chrome.contextMenus.create({"title": menuOption, "contexts":[context],"id": "context" + context,"documentUrlPatterns":["http://*/*"]});
    console.log("'" + context + "' item:" + id);

    var id = chrome.contextMenus.create({"title": "Copy", "contexts":[context],"id": "copy","documentUrlPatterns":["chrome-extension://*/*"]});
    console.log("'" + context + "' item:" + id);
});
