use axum::{
    extract::{
        ws::{Message, WebSocket},
        State, WebSocketUpgrade,
    },
    response::Response,
    routing, Router,
};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use shuttle_runtime::tokio::{self, sync::broadcast};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ChatMessage {
    id: Uuid,
    name: String,
    content: String,
}

#[derive(Deserialize)]
struct NewMessage {
    name: String,
    content: String,
}

#[derive(Clone)]
struct AppState {
    tx: broadcast::Sender<ChatMessage>,
}

async fn index() -> &'static str {
    "Hello, world!"
}

async fn handle_socket(socket: WebSocket, state: AppState) {
    let (mut sender, mut receiver) = socket.split();

    let mut rx = state.tx.subscribe();

    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender
                .send(Message::Text(serde_json::to_string(&msg).unwrap().into()))
                .await
                .is_err()
            {
                tracing::error!("Error occurred while sending message");
                break;
            }
        }
    });

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(msg))) = receiver.next().await {
            let new_msg: NewMessage = serde_json::from_str(&msg).expect("Failed to parse message");

            let msg = ChatMessage {
                id: Uuid::new_v4(),
                name: new_msg.name,
                content: new_msg.content,
            };
            state.tx.send(msg).expect("Failed to send message");
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    }
}

async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

#[shuttle_runtime::main]
async fn main() -> shuttle_axum::ShuttleAxum {
    color_eyre::install().expect("Failed to install color-eyre");

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!(
                    "{}=debug,tower_http=debug,axum::rejection=trace",
                    env!("CARGO_PKG_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::debug!("Tracing is initialized");

    let (tx, _) = broadcast::channel(100);

    let app_state = AppState { tx };

    let router = Router::new()
        .route("/", routing::get(index))
        .route("/ws", routing::get(ws_handler))
        .layer(TraceLayer::new_for_http())
        .with_state(app_state);

    Ok(router.into())
}
