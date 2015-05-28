/*
 * Copyright (C) 2015 End Point Corporation
 * Copyright (C) 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * Controller for the director.
 */
function DirectorController($scope, $rootScope, $http, Director, DirectorEvents) {
  $scope.tabs = [{
    title: 'FREE FLIGHT',
    url: 'freeflight.tpl.html'
  }, {
    title: 'PRESENTATIONS',
    url: 'presentations.tpl.html'
  }, {
    title: 'PANORAMAS',
    url: 'panoramas.tpl.html'
  }, {
    title: 'SEARCH',
    url: 'search.tpl.html'
  }];
  $scope.currentTab = 'freeflight.tpl.html';
  $scope.onClickTab = function(tab) {
    $scope.currentTab = tab.url;
  }
  $scope.$on('$includeContentLoaded', function() {
    if ($scope.currentTab == 'search.tpl.html') {
      // Load the keyboard
      var searchbox = document.getElementById('searchbox');
      VKI_attach(searchbox);
      searchbox.focus();
      // VKI_show() doesn't seem to work immediately; add a delay
      setTimeout(function() {
        VKI_show(searchbox);
      }, 10);
    }
  });
  $scope.isActiveTab = function(tabUrl) {
    return tabUrl == $scope.currentTab;
  }

  $scope.groups = [];
  $scope.group = {};
  $scope.presentation = {};
  $scope.scene = {};
  $scope.groupSelected = false;
  $scope.presentationSelected = null;
  $scope.sceneSelected = null;

  function getHttpUrl(path) {
   return [
    'http://', Director.Hostname, ':', Director.Port, path
   ].join('');
  }

  function DirectorSocket(channel) {
   var url = [
    'ws://', Director.Hostname, ':', Director.Port, '/', channel
   ].join('');
   ws = new WebSocket(url);
   ws.onopen = function() {
    console.log("Connected to " + url);
   };
   ws.onmessage = function(message) {
     //console.log("Received data from websocket: " + message.data);
     $scope[channel] = (JSON.parse(message.data));
     $scope.$apply(); // crucial
   };
   return ws;
  };

  function responseHandler(ws) {
   handler = function(data, status, headers, config) {
    data = JSON.stringify(data)
    //console.log(data);
    ws.send(data); };
   return handler;
  }

  var wsScene = new DirectorSocket('scene');
  var wsGroup = new DirectorSocket('group');
  var wsPresentation = new DirectorSocket('presentation');

  $scope.fetch_groups = function() {
   var url = getHttpUrl('/director_api/presentationgroup/');
   $http({method: 'GET', url: url}).success(
    function(data, status, headers, config) {
     $scope.groups = data.objects;
    }
   )
  };
  $scope.$watch('groups', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    if ($scope.groups.length > 0) {
     $scope.fetch_group($scope.groups[0].resource_uri);
    }
   }
  });

  //TODO Refactor these three functions together.
  $scope.fetch_group = function(resource_uri) {
   var url = getHttpUrl(resource_uri);
   console.log("Fetching Group " + resource_uri);
   $http({method: 'GET', url: url}).success(responseHandler(wsGroup));
  };
  $scope.$watch('group', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.groupSelected = true;
   }
  });

  $scope.presentation_back = function() {
   $scope.groupSelected = false;
  }
  $scope.fetch_presentation = function(resource_uri) {
   var url = getHttpUrl(resource_uri);
   console.log("Fetching Presentation " + resource_uri);
   $http({method: 'GET', url: url}).success(
    responseHandler(wsPresentation));
  };
  $scope.$watch('presentation', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.presentationSelected = $scope.presentation.slug;
    // auto-play if only one scene
    var s = $scope.presentation.scenes;
    if (s.length == 1) {
      $scope.fetch_scene(s[0].resource_uri);
    }
   }
  });

  $scope.scene_back = function() {
   $scope.presentationSelected = false;
  }
  $scope.fetch_scene = function(resource_uri) {
   var url = getHttpUrl(resource_uri);
   console.log("Loading Scene " + resource_uri);
   $http({method: 'GET', url: url}).success(responseHandler(wsScene));
  };
  $scope.$watch('scene', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.sceneSelected = $scope.scene.slug;
    $rootScope.$broadcast(DirectorEvents.SceneChanged, $scope.scene);
   }
  });

  $scope.fetch_groups();
 }
