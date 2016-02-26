'use strict';

/**
 * @ngdoc function
 * @name moCkUperapp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the mockuperApp
 */
angular.module('mockuperApp')
    .controller('ProjectCtrl', ['$scope', 'mockupService', 'loginService', 'projectService', '$routeParams', '$location', '$rootScope', 'breadcrumbService',
        function($scope, mockupService, loginService, projectService, $routeParams, $location, $rootScope, breadcrumbService) {
            loginService.reloadScope();
            $scope.projectId = $routeParams.projectId;
            $scope.logingLog = {};

            $scope.addMockup = function() {
                $location.path('/project/' + $scope.projectId + '/mockup-new');
            };

            io.socket.get('/loginlog', function serverResponded (body, JWR) {
                console.log('Login log get');
                $scope.$apply(function() {
                    for (var i = 0; i < body.length; i++) {
                        $scope.logingLog[body[i].username] = body[i];
                    };
                });
            });

            io.socket.on('loginlog', function onServerSentEvent (msg) {
                console.log(msg);
                $scope.$apply(function(){
                    $scope.logingLog[msg.data.username] = msg.data;
                    $scope.logingLog[msg.data.username].online = true;// ((new Date(msg.data.createdAt)).getTime())
                });
            });

            $scope.workflows = [{
                name: 'start',
                functionName: '',
                className: 'btn-primary'
            }, {
                name: 'close',
                functionName: '',
                className: 'btn-success'
            }, {
                name: 'abandon',
                functionName: '',
                className: 'btn-danger'
            }];
            $scope.mockups = [{
                id: 0,
                name: 'Mockup 1',
                img: 'http://community.protoshare.com/wp-content/uploads/2010/12/example4-anim.gif',
                description: 'abandon'
            }, {
                id: 1,
                name: 'Mockup 2',
                img: 'http://cameronbarrett.com/images/lg_ia1.gif',
                description: 'abandon'
            }];
            $scope.project = null;
            $scope.viewObject = null;
            projectService.projectById.get({
                    projectId: $routeParams.projectId
                })
                .$promise.then(function(result) {
                    $scope.viewObject = result;
                    $scope.project = result;
                    $scope.viewObject.title = 'Project View';
                    $scope.viewObject.editUrl = 'project/edit/' + result.id;
                    try {
                        $rootScope.breadcrumb = breadcrumbService.updateBreadcrumb('project', $scope.project);
                        $rootScope.$digest();
                    } catch(e) {}
                });
        }
    ]);
