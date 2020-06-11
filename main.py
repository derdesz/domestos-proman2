from flask import Flask, render_template, url_for, request
from util import json_response
import data_handler
import sql_data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return sql_data_handler.get_boards()


@app.route("/get-statuses")
@json_response
def get_statuses():
    """
    All the statuses
    """
    return sql_data_handler.get_statuses()


@app.route("/get-cards/<int:board_id>", methods=["GET"])
@json_response
def get_cards(board_id):
    """
        All cards to boardId
    """

    return sql_data_handler.get_cards_by_boardId(board_id)


@app.route('/get-all-cards')
@json_response
def get_all_cards():
    """
        All cards
    """
    return sql_data_handler.get_cards()


@app.route("/rename-board/<board_id>", methods=["POST"])
@json_response
def rename_board(board_id):
    """
    Renames a clicked board
    """
    try:
        new_board_name = request.data.decode()
        sql_data_handler.rename_board(int(board_id), new_board_name)
        return board_id
    except:
        return False


@app.route("/rename-status/<status_id>", methods=["POST"])
@json_response
def rename_status(status_id):
    """
    Renames a status for the given board
    """
    try:
        new_status_name = request.data.decode()
        board_id = sql_data_handler.rename_status(int(status_id), new_status_name)
        return board_id['board_id']
    except:
        return False


@app.route("/add-new-status/<board_id>", methods=["POST"])
@json_response
def add_new_status(board_id):
    """
    Adds a new status title to a given board
    """
    try:
        status_name = request.data.decode()
        sql_data_handler.add_new_status(int(board_id), status_name)
        return board_id
    except:
        return False


@app.route("/add-new-card/<board_id>", methods=["POST"])
@json_response
def add_new_card(board_id):
    """
    Adds a new status title to a given board
    """
    try:
        card_name = request.data.decode()
        status_id_for_new_card = sql_data_handler.get_first_status_id_for_board(board_id)['min']
        sql_data_handler.add_new_card(int(status_id_for_new_card), int(board_id), card_name)
        return board_id
    except:
        return False


@app.route("/move-card/<card_id>", methods=["POST"])
@json_response
def move_card(card_id):
    """
    Adds a new status title to a given board
    """
    try:
        new_status_id = request.data.decode()
        board_id = sql_data_handler.move_card(int(new_status_id), int(card_id))
        return board_id['board_id']
    except:
        return False


@app.route("/create-board", methods=["POST"])
@json_response
def create_board():
    """
    Creates new board
    """
    # data_handler.get_boards()
    try:
        new_board = request.data.decode()
        sql_data_handler.insert_new_board(new_board)
        board_id = sql_data_handler.get_last_board_id()["max"]
        sql_data_handler.insert_initial_statuses(board_id)
        return board_id
    except:
        return False


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    #return data_handler.get_cards_for_board(board_id)
    pass


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
