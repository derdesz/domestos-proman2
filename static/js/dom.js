// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },

    loadBoards: function (boardId) {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards, boardId);
        });
    },

    showBoards: function (boards, boardId) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        //const container = document.querySelector(".board-container");

        let boardList = '';

        for (let board of boards) {

            boardList += `

             <div class="${board.id == boardId ? 'board-editor-closed' : 'board-editor-open'} open-board">${board.title}</div>
             <section class="board ${board.id == boardId ? 'board-editor-open' : 'board-editor-closed'}">

                <div class="non-editable-board-name board-editor-open board-header" style="font-size: 25px;">${board.title}</div>
                <div class="board-editor-closed board-header">
                    <input id="${board.id}" type="text" value="${board.title}" style="font-size: 25px;">
                    <button type="button" class="save-renamed-board">Save</button>
                    <button type="button" class="close-new-board">Cancel</button>
                </div>
                
                <div class="column-card-buttons">
                
                    <div class="board-editor-open add_new_column_button">
                        <button type="button" class="add-new-column">Add new column</button>
                    </div>
                    <div class="board-editor-closed add-new-column-input">
                        <input data-board-id="${board.id}" type="text" placeholder="Column name ..." value="">
                        <button type="button" class="save-new-column">Save</button>
                        <button type="button" class="cancel-new-column">Cancel</button>
                    </div>
                    <div class="board-editor-open add_new_card_button">
                        <button type="button" class="add-new-card">Add new card</button>
                    </div>
                    <div class="board-editor-closed add-new-card-input">
                        <input data-board-id="${board.id}" type="text" placeholder="Card name ..." value="">
                        <button type="button" class="save-new-card">Save</button>
                        <button type="button" class="cancel-new-card">Cancel</button>
                    </div>
                    
                </div>
                      
                    
                <div class="board-columns" data-board-id="${board.id}"></div>
                <button type="button" class="close-board">Close</button>
             </section>    
            `;

        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);

        let allBoards = document.querySelectorAll(".board");
        for (let element of allBoards) {
            element.children[0].addEventListener("click", (event) => {
                const nonEditableFields = document.querySelectorAll(".non-editable-board-name");
                for (let field of nonEditableFields) {
                    if (field.classList.contains("board-editor-closed")) {
                        return;
                    }
                }
                //console.log(nonEditableFields);
                //
                let nonEditableBoardName = event.target;
                nonEditableBoardName.classList.replace("board-editor-open", "board-editor-closed");
                element.children[1].classList.replace("board-editor-closed", "board-editor-open");
            });
        }
        let cancelButtons = document.querySelectorAll(".close-new-board");
        for (let element of cancelButtons) {
            element.addEventListener("click", (event) => {
                event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                event.target.parentElement.parentElement.children[0].classList.replace("board-editor-closed", "board-editor-open");
                event.target.parentElement.children[0].value = event.target.parentElement.parentElement.children[0].innerHTML;
            });
        }
        let saveButtons = document.querySelectorAll(".save-renamed-board");
        for (let button of saveButtons) {
            button.addEventListener("click", (event) => {
                const renameInput = event.target.parentElement.children[0];
                if (renameInput && renameInput.value) {
                    dataHandler.renameBoard(renameInput.id, renameInput.value, this.loadBoards);
                    renameInput.value = '';
                    event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                    event.target.parentElement.parentElement.children[0].classList.replace("board-editor-closed", "board-editor-open");
                }
            });
        }

        let openBoardButtons = document.querySelectorAll(".open-board");
        for (let button of openBoardButtons) {
            button.addEventListener("click", (event) => {
                const allBoards = document.querySelectorAll(".board");
                for (let board of allBoards) {
                    if (board.classList.contains("board-editor-open")) {
                        return;
                    }
                }
                event.target.classList.replace("board-editor-open", "board-editor-closed");
                event.target.nextElementSibling.classList.replace("board-editor-closed", "board-editor-open");
            });
        }

        let closeBoardButtons = document.querySelectorAll(".close-board");
        for (let button of closeBoardButtons) {
            button.addEventListener("click", (event) => {
                event.target.parentElement.previousElementSibling.classList.replace("board-editor-closed", "board-editor-open");
                event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
            });
        }

        var boards = document.querySelectorAll(".board-container");

        if (boards.length > 1
        ) {
            boards[0].remove();
        }
        dom.addNewColumn();
        dom.loadStatuses();
    },

    loadStatuses: function () {
        // retrieves statuses and makes showStatuses called
        dataHandler.getStatuses(function (statuses) {
            dom.showStatuses(statuses);
        });
    },

    showStatuses: function (statuses) {
        // shows the statuses of a board
        let allBoardColumns = document.querySelectorAll(".board-columns");
        for (let boardColumnsForOneBoard of allBoardColumns) {
            for (let status of statuses.filter(f => f.board_id == boardColumnsForOneBoard.getAttribute("data-board-id"))) {
                let boardColumnTitle = document.createElement("div");
                boardColumnTitle.classList.add("board-column-title");
                boardColumnTitle.classList.add("board-editor-open");
                boardColumnTitle.innerText = status.title;

                let editorContent = `<input type="text" data-status-id="${status.id}" value="${status.title}">
                    <button type="button" class="save-renamed-status">Save</button>
                    <button type="button" class="close-status-rename">Cancel</button>`

                let boardColumnTitleEditor = document.createElement("div");
                boardColumnTitleEditor.classList.add("board-column-title-editor");
                boardColumnTitleEditor.classList.add("board-editor-closed");
                boardColumnTitleEditor.innerHTML = editorContent;

                let boardColumnContent = document.createElement("div");
                boardColumnContent.classList.add("board-column-content");
                boardColumnContent.id = status.id;
                boardColumnContent.setAttribute('data-board-id', `${boardColumnsForOneBoard.parentElement.children[1].children[0].id}`)


                let boardColumn = document.createElement("div");
                boardColumn.classList.add("board-column");


                boardColumn.appendChild(boardColumnTitle);
                boardColumn.appendChild(boardColumnTitleEditor);
                boardColumn.appendChild(boardColumnContent);

                boardColumnsForOneBoard.appendChild(boardColumn);
            }

            dom.renameColumns();
            dom.addNewCard();
            let boardId = boardColumnsForOneBoard.parentElement.children[1].children[0].id
            dom.loadCards(boardId);
        }

    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },

    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also

        for (let card of cards) {

            let boardColumnContent = document.querySelectorAll(`[data-board-id="${card.board_id}"]`);
            for (let column of boardColumnContent) {
                if (`${card.status_id}` === column.id) {
                    let cardSlot = document.createElement("div");
                    cardSlot.classList.add("card");
                    cardSlot.draggable = true;
                    cardSlot.id = card.id;
                    cardSlot.innerText = card.title;
                    column.appendChild(cardSlot);

                }
            }

        }
        dom.moveCards();

    },

    addNewBoard: function () {
        //adds new board to the database
        document.getElementById('pop-up-btn').addEventListener("click", (event) => {
            let popUpForm = document.getElementById("form");
            popUpForm.style.display = 'block';
        });
        document.getElementById('save_new_board').addEventListener("click", (event) => {
            const newBoard = document.getElementById('new-board-name');
            if (newBoard && newBoard.value) {
                dataHandler.createNewBoard(newBoard.value, this.loadBoards);
                let popUpForm = document.getElementById("form");
                popUpForm.style.display = 'none';
                newBoard.value = '';
            }
        });

    },

    renameColumns: function () {
        //adds EventListeners to the column titles
        const columns = document.querySelectorAll(".board-column");
        for (let column of columns) {
            column.children[0].addEventListener("click", (event) => {
                const nonEditableStatuses = document.querySelectorAll(".board-column-title");
                for (let status of nonEditableStatuses) {
                    if (status.classList.contains("board-editor-closed")) {
                        return;
                    }
                }
                let nonEditableStatus = event.target;
                nonEditableStatus.classList.replace("board-editor-open", "board-editor-closed");
                nonEditableStatus.nextElementSibling.classList.replace("board-editor-closed", "board-editor-open");

            });

        }
        let cancelButtons = document.querySelectorAll(".close-status-rename");
        for (let element of cancelButtons) {
            element.addEventListener("click", (event) => {
                event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                event.target.parentElement.parentElement.children[0].classList.replace("board-editor-closed", "board-editor-open");
                event.target.parentElement.children[0].value = event.target.parentElement.parentElement.children[0].innerHTML;
            });
        }

        let saveButtons = document.querySelectorAll(".save-renamed-status");
        for (let button of saveButtons) {
            button.addEventListener("click", (event) => {
                const renameInput = event.target.parentElement.children[0];
                if (renameInput && renameInput.value) {
                    dataHandler.renameStatus(renameInput.getAttribute("data-status-id"), renameInput.value, this.loadBoards);
                    renameInput.value = '';
                    event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                    event.target.parentElement.parentElement.children[0].classList.replace("board-editor-closed", "board-editor-open");
                }
            });
        }
    },

    addNewColumn: function () {
        let addNewColumnButtons = document.querySelectorAll(".add_new_column_button");
        for (let button of addNewColumnButtons) {
            button.addEventListener("click", (event) => {
                button.classList.replace("board-editor-open", "board-editor-closed");
                button.parentElement.children[1].classList.replace("board-editor-closed", "board-editor-open");

            });

        }
        let cancelButtons = document.querySelectorAll(".cancel-new-column");
        for (let element of cancelButtons) {
            element.addEventListener("click", (event) => {
                event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                event.target.parentElement.parentElement.children[0].classList.replace("board-editor-closed", "board-editor-open");
                event.target.parentElement.children[0].value = "";
            });
        }

        let saveButtons = document.querySelectorAll(".save-new-column");
        for (let button of saveButtons) {
            button.addEventListener("click", (event) => {
                const renameInput = event.target.parentElement.children[0];
                if (renameInput && renameInput.value) {
                    dataHandler.addNewStatus(renameInput.getAttribute("data-board-id"), renameInput.value, this.loadBoards);
                    renameInput.value = '';
                    event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                    event.target.parentElement.parentElement.children[0].classList.replace("board-editor-closed", "board-editor-open");
                }
            });
        }
    },

    addNewCard: function () {
        let addNewCardButtons = document.querySelectorAll(".add_new_card_button");
        for (let button of addNewCardButtons) {
            button.addEventListener("click", (event) => {
                button.classList.replace("board-editor-open", "board-editor-closed");
                button.parentElement.children[3].classList.replace("board-editor-closed", "board-editor-open");

            });

        }
        let cancelButtons = document.querySelectorAll(".cancel-new-card");
        for (let element of cancelButtons) {
            element.addEventListener("click", (event) => {
                event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                event.target.parentElement.parentElement.children[2].classList.replace("board-editor-closed", "board-editor-open");
                event.target.parentElement.children[0].value = "";
            });
        }

        let saveButtons = document.querySelectorAll(".save-new-card");
        for (let button of saveButtons) {
            button.addEventListener("click", (event) => {
                const renameInput = event.target.parentElement.children[0];
                if (renameInput && renameInput.value) {
                    dataHandler.addNewCard(renameInput.getAttribute("data-board-id"), renameInput.value, this.loadBoards);
                    renameInput.value = '';
                    event.target.parentElement.classList.replace("board-editor-open", "board-editor-closed");
                    event.target.parentElement.parentElement.children[3].classList.replace("board-editor-closed", "board-editor-open");
                }
            });
        }


    },

    moveCards: function () {
        // Initialize drag & drop elements here
        let cards = document.querySelectorAll('.card');
        let statusColumns = document.querySelectorAll('.board-column');

        // Fill listeners
        for (let card of cards) {
            if (!card.classList.contains("event-listenered")) {
                card.classList.add("event-listenered");
                card.addEventListener('dragstart', dragStart);
                card.addEventListener('dragend', dragEnd);
            }
        }

        //loop through empties and call drag events
        for (let column of statusColumns) {
            if (!column.classList.contains("event-listenered")) {
                column.classList.add("event-listenered");
                column.addEventListener('dragover', dragOver);
                column.addEventListener('dragenter', dragEnter);
                // column.addEventListener('dragleave', dragLeave);
                column.addEventListener('drop', dragDrop);
            }


        }

        // Drag functions

        function dragStart() {
            this.classList.add('hold');
        }

        function dragEnd() {
            this.classList.remove('hold');
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function dragEnter(e) {
            e.preventDefault();
        }

        // function dragLeave() {
        // }

        function dragDrop() {
            let cardToAdd = document.querySelector('.hold');
            let newStatusId = this.children[2].id;
            let cardToAddId = cardToAdd.id;
            dataHandler.moveCard(cardToAddId, newStatusId, dom.loadBoards);
        }

    }

}