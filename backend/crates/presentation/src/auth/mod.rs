mod extractor;
mod login;
mod logout;

use axum::{routing::post, Router};
pub use extractor::{AuthenticatedUser, VerifySessionUseCaseProvider};

use crate::AppState;

pub fn auth() -> Router<AppState> {
    Router::new()
        .route("/login", post(login::login))
        .route("/logout", post(logout::logout))
}
