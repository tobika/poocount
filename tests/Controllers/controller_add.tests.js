describe('Controller Add', function(){
    var scope, controller;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(module('starter.services'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('AddCtrl', {$scope: scope});
    }));

    // tests start here
    it('Controller exists', function(){

        expect(controller).toBeDefined();
    });

    //it('convertToDate', function(){

        //expect(scope.options).toEqual(options);
    //});
});