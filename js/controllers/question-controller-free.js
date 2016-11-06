app.controller('QuestionControllerFree', function ($scope, $rootScope, $http, $routeParams, $location, $mdDialog, $mdToast) {

    var getNumberLikes = function (question) {
        $http.get($rootScope.serviceBase + "questions/likes/question/" + question.id).then(function (response) {
            question.numberLikes = response.data.length;
        })
    };

// GetAll - Lista questions
    $scope.questions = [];
    $http.get($rootScope.serviceBase + "questions").then(function (response) {
        $scope.questions = response.data;
        for(var i = 0; i < $scope.questions.length; i++) {
            getNumberLikes($scope.questions[i]);
        }
    }, function (error) {
        // failure
    });

    $scope.listComments = function (answer) {
        $http.get($rootScope.serviceBase + "comment/answers/answer/" + answer.id)
            .then(
                function (response) {
                    $scope.comments = response.data;
                }, function (error) {
                    // failure
                }
            );
    };

    $scope.commentSelected = function(answer) {
        $scope.selected = answer.id;
        $scope.listComments(answer);
    };

    $scope.getOne = function (id) {
        $http.get($rootScope.serviceBase + "questions/" + id).then(function (response) {
            $scope.question = response.data;
            $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
                $scope.answers = response.data;
                $scope.numberAnswers = response.data.length;
            });
            getNumberLikes($scope.question);
            $location.path("/free/questions/" + id);
        }, function (error) {
            if (error.status == 404) {
                $location.path('/404');
            }
        });
    }

    // GetOne - Chama Question solicitada
    if ($routeParams.id != null) {
        $scope.getOne($routeParams.id);
    }
});
