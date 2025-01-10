use axum::{extract::State, routing::get, Router};
use sqlx::postgres::PgPool;
use tracing::info;

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

async fn hello_world(_app_state: State<AppState>) -> &'static str {
    info!("Hello");
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn main(#[shuttle_shared_db::Postgres] pool: PgPool) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let router = Router::new()
        .route("/", get(hello_world))
        .with_state(AppState { pool });

    Ok(router.into())
}
