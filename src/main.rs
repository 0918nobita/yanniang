use axum::Router;
use sqlx::postgres::PgPool;
use tower_http::services::ServeDir;

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

#[shuttle_runtime::main]
async fn main(#[shuttle_shared_db::Postgres] pool: PgPool) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let router = Router::new()
        .fallback_service(ServeDir::new("./static"))
        .with_state(AppState { pool });

    Ok(router.into())
}
