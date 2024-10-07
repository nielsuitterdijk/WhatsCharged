import asyncio
import websockets
import json


async def send_message():
    uri = "ws://127.0.0.1:8000/ocpp/someuuid/"  # Replace with your WebSocket URL

    async with websockets.connect(
        uri,
        extra_headers={
            "Sec-WebSocket-Protocol": "v2.0.1",
            "origin": "ws://localhost:8000",
        },
    ) as websocket:
        # Example payload to send (change this to match your message format)
        message = {
            "type": "type_a",  # Replace with actual type
            "payload": {"key1": "value1", "key2": "value2"},
        }

        # Convert the message to JSON format
        await websocket.send(json.dumps(message))
        print(f"Message sent: {message}")

        # # Wait for the response (optional)
        # response = await websocket.recv()
        # print(f"Response received: {response}")


# Run the event loop
asyncio.get_event_loop().run_until_complete(send_message())
