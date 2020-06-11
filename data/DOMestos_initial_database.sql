ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_statuses_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_boards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_cards_id CASCADE;


DROP TABLE IF EXISTS public.cards;
CREATE TABLE cards (
    id serial NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    card_order integer
);

DROP TABLE IF EXISTS public.statuses;
CREATE TABLE statuses (
    id serial NOT NULL,
    board_id integer,
    title text
);

DROP TABLE IF EXISTS public.boards;
CREATE TABLE boards (
    id serial NOT NULL,
    title text
);


ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_boards_id PRIMARY KEY (id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_statuses_id PRIMARY KEY (id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_cards_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_statuses_id FOREIGN KEY (status_id) REFERENCES statuses(id);

INSERT INTO boards (title) VALUES ('Board 1');
INSERT INTO boards (title) VALUES ('Board 2');
INSERT INTO boards (title) VALUES ('Quarantine Shopping List');

INSERT INTO statuses (board_id, title) VALUES (1, 'new');
INSERT INTO statuses (board_id, title) VALUES (1, 'in progress');
INSERT INTO statuses (board_id, title) VALUES (1, 'testing');
INSERT INTO statuses (board_id, title) VALUES (1, 'done');
INSERT INTO statuses (board_id, title) VALUES (2, 'new');
INSERT INTO statuses (board_id, title) VALUES (2, 'in progress');
INSERT INTO statuses (board_id, title) VALUES (2, 'testing');
INSERT INTO statuses (board_id, title) VALUES (2, 'done');
INSERT INTO statuses (board_id, title) VALUES (3, 'new');
INSERT INTO statuses (board_id, title) VALUES (3, 'in progress');
INSERT INTO statuses (board_id, title) VALUES (3, 'testing');
INSERT INTO statuses (board_id, title) VALUES (3, 'done');

INSERT INTO cards (board_id, title, status_id, card_order) VALUES (1, 'new card 1', 1, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (1, 'new card 2', 1, 1);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (1, 'in progress card', 2, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (1, 'planning', 3, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (1, 'done card 1', 4, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (1, 'done card 1', 4, 1);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (2, 'new card 1', 5, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (2, 'new card 2', 5, 1);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (2, 'in progress card', 6, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (2, 'planning', 7, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (2, 'done card 1', 8, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (2, 'done card 1', 8, 1);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (3, 'Beer', 9, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (3, 'Pizza', 9, 1);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (3, 'Wine', 10, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (3, 'More wine', 10, 1);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (3, 'How to live in quarantine', 11, 0);
INSERT INTO cards (board_id, title, status_id, card_order) VALUES (3, 'Ice cream', 12, 0);

