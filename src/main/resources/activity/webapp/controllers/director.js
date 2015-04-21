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
 * Controller for the search box.
 * 
 * @author Adam Vollrath <adam@endpoint.com>
 */
function DirectorController($scope, $rootScope, UIEvents) {
  /**
   * Activates Presentation mode.
   */
  $scope.activate = function() {
    $rootScope.$broadcast(UIEvents.Director.Activated);
    $scope.directing = true;
  }

  /**
   * Deactivates Presentation mode.
   */
  $scope.deactivate = function() {
    $rootScope.$broadcast(UIEvents.Director.Deactivated);
    $scope.directing = false;
  }

  $scope.$on(UIEvents.Planet.SelectPlanet, function($event, planet) {
    if (planet == 'notearth') {
      $scope.activate();
    } else {
      $scope.deactivate();
    }
  });

  $scope.checkVisibility = function() {
    //return $scope.planet != Planets.Earth;
  }
}
