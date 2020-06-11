from psycopg2 import sql

from psycopg2.extras import RealDictCursor

import database_connection


@database_connection.connection_handler
def get_boards(cursor: RealDictCursor) -> list:
    query = """SELECT * 
               FROM boards
               ORDER BY id ASC"""
    cursor.execute(query)
    return cursor.fetchall()


@database_connection.connection_handler
def get_statuses(cursor: RealDictCursor) -> list:
    query = """SELECT * 
               FROM statuses
               ORDER BY id"""
    cursor.execute(query)
    return cursor.fetchall()


@database_connection.connection_handler
def insert_new_board(cursor: RealDictCursor, title) -> list:
    query = sql.SQL("""
               INSERT INTO boards (title)
               VALUES ({})""").format(sql.Literal(title))
    cursor.execute(query)


@database_connection.connection_handler
def get_last_board_id(cursor: RealDictCursor) -> list:
    query = """SELECT MAX(id)
               FROM boards"""
    cursor.execute(query)
    return cursor.fetchone()


@database_connection.connection_handler
def insert_initial_statuses(cursor: RealDictCursor, board_id) -> list:
    query = sql.SQL("""
               INSERT INTO statuses (board_id, title)
               VALUES ({},'new')""").format(sql.Literal(board_id))
    cursor.execute(query)
    query = sql.SQL("""
                   INSERT INTO statuses (board_id, title)
                   VALUES ({},'in progress')""").format(sql.Literal(board_id))
    cursor.execute(query)
    query = sql.SQL("""
                   INSERT INTO statuses (board_id, title)
                   VALUES ({},'testing')""").format(sql.Literal(board_id))
    cursor.execute(query)
    query = sql.SQL("""
                   INSERT INTO statuses (board_id, title)
                   VALUES ({},'done')""").format(sql.Literal(board_id))
    cursor.execute(query)


@database_connection.connection_handler
def rename_board(cursor: RealDictCursor, id, text) -> list:
    query = sql.SQL("""
                   UPDATE boards
                   SET title = {}
                   WHERE id = {}
                   """).format(sql.Literal(text), sql.Literal(id))
    cursor.execute(query)


@database_connection.connection_handler
def rename_status(cursor: RealDictCursor, id, text) -> list:
    query = sql.SQL("""
                   UPDATE statuses
                   SET title = {}
                   WHERE id = {}
                   """).format(sql.Literal(text), sql.Literal(id))
    cursor.execute(query)
    query = sql.SQL("""
                       SELECT board_id FROM statuses
                       WHERE id = {}
                       """).format(sql.Literal(id))
    cursor.execute(query)
    return cursor.fetchone()


@database_connection.connection_handler
def add_new_status(cursor: RealDictCursor, board_id, status_name) -> list:
    query = sql.SQL("""
               INSERT INTO statuses (board_id, title)
               VALUES ({},{})""").format(sql.Literal(board_id), sql.Literal(status_name))
    cursor.execute(query)


@database_connection.connection_handler
def get_cards_by_boardId(cursor: RealDictCursor, boardId) -> list:
    query = sql.SQL("""SELECT * 
               FROM cards
               WHERE board_id = {}""").format(sql.Literal(boardId))
    cursor.execute(query)
    return cursor.fetchall()


@database_connection.connection_handler
def get_cards(cursor: RealDictCursor) -> list:
    query = """SELECT *
               FROM cards
               """
    cursor.execute(query)
    return cursor.fetchall()


@database_connection.connection_handler
def get_first_status_id_for_board(cursor: RealDictCursor, board_id) -> list:
    query = sql.SQL("""SELECT MIN(id)
               FROM statuses
               WHERE board_id= {}""").format(sql.Literal(board_id))
    cursor.execute(query)
    return cursor.fetchone()


@database_connection.connection_handler
def add_new_card(cursor: RealDictCursor, status_id, board_id, status_name) -> list:
    query = sql.SQL("""
               INSERT INTO cards (board_id, title, status_id, card_order)
               VALUES ({},{},{},0)""").format(sql.Literal(board_id), sql.Literal(status_name), sql.Literal(status_id))
    cursor.execute(query)


@database_connection.connection_handler
def move_card(cursor: RealDictCursor, new_status_id, card_id) -> list:
    query = sql.SQL("""
                   UPDATE cards
                   SET status_id = {}
                   WHERE id = {}
                   """).format(sql.Literal(new_status_id), sql.Literal(card_id))
    cursor.execute(query)
    query = sql.SQL("""
                       SELECT board_id FROM cards
                       WHERE id = {}
                       """).format(sql.Literal(card_id))
    cursor.execute(query)
    return cursor.fetchone()
