// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: data
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object

    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        });
    },

    // getAllCards: function (callback) {
    //     this._api_get('/get-all-cards', (response) => {
    //         this._data['cards'] = response;
    //         callback(response);
    //     });
    // },

    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/create-board', boardTitle, (response) => {
            this._data['boards'] = response;
            callback(response);
        });

    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    },
    addNewCard: function (boardId, cardTitle, callback) {
        // creates new card, saves it and calls the callback function with its data
        this._api_post(`/add-new-card/${boardId}`, cardTitle, (response) => {
            this._data['boards'] = response;
            callback(response);
        })

    },


    // here comes more features
    renameBoard: function (boardId, newBoardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post(`/rename-board/${boardId}`, newBoardTitle, (response) => {
            this._data['boards'] = response;
            callback(response);
        });

    },

    renameStatus: function (statusID, newStatusTitle, callback) {
        // renames existing status, saves it and calls the callback function with its data
        this._api_post(`/rename-status/${statusID}`, newStatusTitle, (response) => {
            this._data['boards'] = response;
            callback(response);
        });

    },

    addNewStatus: function (boardId, statusTitle, callback) {
        // creates new status for given board, saves it and calls the callback function with its data
        this._api_post(`/add-new-status/${boardId}`, statusTitle, (response) => {
            this._data['boards'] = response;
            callback(response);
        });

    },

    moveCard: function (cardId, newStatusId, callback) {
        // creates new status for given board, saves it and calls the callback function with its data
        this._api_post(`/move-card/${cardId}`, newStatusId, (response) => {
            this._data['boards'] = response;
            callback(response);
        });

    }
};
