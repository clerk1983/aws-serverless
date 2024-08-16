# NoSQL(DynamoDB)

## rsv-attributes

key(PK), value

## rsv-game

game_id(PK), started_at, winner_disc, end_at

## rsv-turns

game_id(PK), turn_count(SK), turn_id, disc, x, y, next_disc, end_at

## rsv-square

turn_id(PK), [{x, y, disc},...]
