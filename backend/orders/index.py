import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Приём заказов от клиентов сайта Роллекс."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    address = body.get("address", "").strip()
    comment = body.get("comment", "").strip()

    if not name or not phone or not address:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Заполните все обязательные поля"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO orders (name, phone, address, comment) VALUES (%s, %s, %s, %s) RETURNING id",
        (name, phone, address, comment),
    )
    order_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"ok": True, "order_id": order_id}),
    }
