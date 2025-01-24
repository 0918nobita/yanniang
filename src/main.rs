use axum::{extract::State, http::HeaderValue, routing::get, Json, Router};
use serde::Serialize;
use shuttle_runtime::SecretStore;
use sqlx::postgres::PgPool;
use tower_http::cors::CorsLayer;

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

#[derive(Serialize)]
struct MyLearningContent {
    front: String,
    back: String,
    front_lang: String,
    back_lang: String,
}

async fn list_learning_contents(_state: State<AppState>) -> Json<Vec<MyLearningContent>> {
    Json(vec![
        MyLearningContent {
            front: "你好".to_owned(),
            back: "こんにちは".to_owned(),
            front_lang: "zh-CN".to_owned(),
            back_lang: "ja-JP".to_owned(),
        },
        MyLearningContent {
            front: "minä".to_owned(),
            back: "私".to_owned(),
            front_lang: "fi-FI".to_owned(),
            back_lang: "ja-JP".to_owned(),
        },
    ])
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_runtime::Secrets] secrets: SecretStore,
    #[shuttle_shared_db::Postgres] pool: PgPool,
) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let frontend_origin = secrets
        .get("FRONTEND_ORIGIN")
        .expect("FRONTEND_ORIGIN not set");

    let cors = CorsLayer::new().allow_origin(
        frontend_origin
            .parse::<HeaderValue>()
            .expect("Failed to parse frontend origin"),
    );

    let router = Router::new()
        .route("/learning_content", get(list_learning_contents))
        .with_state(AppState { pool })
        .layer(cors);

    Ok(router.into())
}
