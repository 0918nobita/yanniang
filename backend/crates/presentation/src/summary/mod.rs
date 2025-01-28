use axum::{routing::get, Router};

use crate::AppState;

mod find_by_uuid;
mod list;

pub fn summaries() -> Router<AppState> {
    Router::new()
        .route("/", get(list::list_summaries))
        .route("/{summary_uuid}", get(find_by_uuid::find_by_uuid))
}
