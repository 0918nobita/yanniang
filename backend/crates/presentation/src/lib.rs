use axum::Router;

mod auth;
mod state;
mod summary;

pub use state::AppState;
use tower_cookies::CookieManagerLayer;

pub fn routes() -> Router<AppState> {
    Router::new()
        .merge(auth::auth())
        .nest("/summary", summary::summaries())
        .layer(CookieManagerLayer::new())
}
