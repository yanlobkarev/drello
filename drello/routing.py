from channels.routing import route
from schnapps.board.consumers import ws_connect, ws_disconnect, ws_message


channel_routing = [
    route('websocket.connect', ws_connect),
    route('websocket.disconnect', ws_disconnect),
    route('websocket.receive', ws_message),
]

