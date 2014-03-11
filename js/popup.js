// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * This class wraps the popup's form, and performs the proper clearing of data
 * based on the user's selections. It depends on the form containing a single
 * select element with an id of 'timeframe', and a single button with an id of
 * 'button'. When you write actual code you should probably be a little more
 * accepting of variance, but this is just a sample app. :)
 *
 * Most of this is boilerplate binding the controller to the UI. The bits that
 * specifically will be useful when using the BrowsingData API are contained in
 * `parseMilliseconds_`, `handleCallback_`, and `handleClick_`.
 *
 * @constructor
 */

var urlArray = {};


$(function(){     
  //SYNC STUFF dont' work atm
  chrome.storage.sync.get("imageKeeperSync",function(storage){
    urlArray = storage.imageKeeperSync
    console.log("sync storage")
    console.log(urlArray)
  })

  //When the page is loaded, get all the bookmarks
  //
  chrome.storage.local.get(["imageKeeper","imageKeeperUrlTagMap","imageKeeperTagUrlMap"],function(storage){
    //Retrieve the bookmark object from storage.
    //
    urlArray = storage.imageKeeper
    urlTagMap = storage.imageKeeperUrlTagMap
    tagUrlMap = storage.imageKeeperTagUrlMap
    console.log(storage.imageKeeperUrlTagMap)
    console.log(urlArray)
   
    //If it doesn't exist, then create it
    //
    if(!urlArray){
      urlArray = {};
    }

    //For each manga, create a link to it
    //
    for (var key in urlArray) {
      if (urlArray.hasOwnProperty(key)) {
        var imageUrl = urlArray[key]                   
        $("#images").append('<div class="col-sm-6 col-md-2" id="'+key+'"></div>')                
        $("#"+key).append('<div class="thumbnail" id="'+key+'_thumbnail"><img class="" src="'+imageUrl+'" alt="..." style="height:75px;"></div>')        
        $("#"+key+"_thumbnail").append('<div class="caption"><input class="tagger" id="'+key+'_tagger" data-value="'+key+'"></input></div>')
        for(var tag in urlTagMap[key]){
          console.log(urlTagMap[key][tag])
          $("#"+key+"_thumbnail").append("#"+urlTagMap[key][tag]+" " )
        }
        
      }
    }
     $("#tags").keyup(function(event) {    
      if ( event.which == 13 ) {            
        var tags = $("#tags").val()
        $("#images").html("")
        for(var keys in tagUrlMap[tags]){
          var key = tagUrlMap[tags][keys]
          var imageUrl = urlArray[key]
          $("#images").append('<div class="col-sm-6 col-md-2" id="'+key+'"></div>')                
        $("#"+key).append('<div class="thumbnail" id="'+key+'_thumbnail"><img class="" src="'+imageUrl+'" alt="..." style="height:75px;"></div>')        
        $("#"+key+"_thumbnail").append('<div class="caption"><input class="tagger" id="'+key+'_tagger" data-value="'+key+'"></input></div>')
        for(var tag in urlTagMap[key]){
          console.log(urlTagMap[key][tag])
          $("#"+key+"_thumbnail").append("#"+urlTagMap[key][tag]+" " )
        }
        }

      
      }    
    })
    chrome.storage.sync.set({"imageKeeperSync":urlArray},function(){

    })
  });
  $("#search").on('click',function(event) {                
      console.log('clicked')

  }) 
});

$(document).ready(function(){  
  console.log("laoded?")
  
   $("#images").on("keyup",".tagger",function(event){
    if(event.which == 13){
      console.log($(this).attr("data-value"))
      console.log($(this).val())
      var key = $(this).attr("data-value")
      var tag = $(this).val()
      chrome.storage.local.get(["imageKeeperUrlTagMap","imageKeeperTagUrlMap"],function(storage){
          urlTagMap = storage.imageKeeperUrlTagMap
          if(!urlTagMap){
            urlTagMap = {}
          }
          if(!urlTagMap[key]){
            urlTagMap[key] = []
          }
          urlTagMap[key].push(tag)
          console.log(urlTagMap)
          chrome.storage.local.set({"imageKeeperUrlTagMap":urlTagMap},function(){})  

         tagUrlMap = storage.imageKeeperTagUrlMap
         if(!tagUrlMap){
           tagUrlMap = {}
         }
         if(!tagUrlMap[tag]){
            tagUrlMap[tag] = []
         }
         tagUrlMap[tag].push(key)
         chrome.storage.local.set({"imageKeeperTagUrlMap":tagUrlMap},function(){})

      });   
      $("#"+key+"_thumbnail").append("#"+tag+" " )
      $(this).val("")   
    }
   })
})


