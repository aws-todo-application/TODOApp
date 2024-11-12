import time
import psycopg2
from psycopg2 import OperationalError

def wait_for_db():
    while True:
        try:
            conn = psycopg2.connect(
                dbname="todoApp_db",
                user="postgres",
                password="password",
                host="db"
            )
            conn.close()
            break
        except OperationalError:
            print("Database not ready, waiting...")
            time.sleep(3)

if __name__ == "__main__":
    wait_for_db()
