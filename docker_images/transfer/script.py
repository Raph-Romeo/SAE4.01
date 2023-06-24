import MySQLdb
from nats.aio.client import Client as NATS
import asyncio
import json
import time

def connect():
    try:
        connection = MySQLdb.connect(host="172.16.1.20", user="toto", password="toto", db="ironbank")
        print("Established connection with database")
        return connection
    except:
        time.sleep(2)
        return connect()

def transfer_funds(account_id_source,account_id_destination,amount):
    try:
        print(f"NATS - TRANSFER {amount} Euros, SOURCE ID : {account_id_source} DESTINATION ID : {account_id_destination}")

        cursor.execute(f"SELECT balance FROM SAE403_account WHERE id ='{account_id_source}'")
        balance = float(cursor.fetchone()[0])
        cursor.execute(f"UPDATE SAE403_account SET balance = '{balance - amount}' WHERE id = '{account_id_source}'")

        cursor.execute(f"SELECT balance FROM SAE403_account WHERE id ='{account_id_destination}'")
        balance = float(cursor.fetchone()[0])
        cursor.execute(f"UPDATE SAE403_account SET balance = '{balance + amount}' WHERE id = '{account_id_destination}'")


        conn.commit()

        return True
    except:
        return False


async def message_handler(msg):
    data = msg.data
    data = json.loads(data.decode())
    transfer_funds(data["account_id_source"],data["account_id_destination"],data["amount"])

async def subscribe_to_topic():
    nc = NATS()
    await nc.connect(servers=[nats_address])
    await nc.subscribe(topic, cb=message_handler)
    while True:
        await asyncio.sleep(1)


if __name__ == "__main__":
    conn = connect()
    cursor = conn.cursor()
    nats_address = "nats://172.16.1.30:4222"
    topic = 'ironbank/transfer'
    print(f"Listening on subject '{topic}'")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(subscribe_to_topic())
