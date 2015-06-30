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
 * A Service for interactions with the Pano Viewer activity group.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
LiquidGalaxyApp.service('PanoViewerService', function($rootScope, MasterService, ActivityGroups) {

  /**
   * Starts up the Street View activity group.
   */
  function startup() {
    //console.debug(StreetViewMessages.Startup);
    MasterService.startupLiveActivityGroupByName(ActivityGroups.PanoViewer);
  }

  /**
   * Shuts down the Street View activity group.
   */
  function shutdown() {
    //console.debug(StreetViewMessages.Shutdown);
    MasterService.shutdownLiveActivityGroupByName(ActivityGroups.PanoViewer);
  }

  /**
   * Activates the Street View activity group.
   */
  function activate() {
    //console.debug(StreetViewMessages.Activate);
    MasterService.activateLiveActivityGroupByName(ActivityGroups.PanoViewer);
  }

  /**
   * Deactivates the Street View activity group.
   */
  function deactivate() {
    //console.debug(StreetViewMessages.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(ActivityGroups.PanoViewer);
  }

  /**
   * Public interface.
   */
  return {
    startup: startup,
    shutdown: shutdown,
    activate: activate,
    deactivate: deactivate
  };
});
