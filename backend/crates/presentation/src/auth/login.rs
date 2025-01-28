use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Deserialize;
use tower_cookies::{
    cookie::{
        time::{Duration, OffsetDateTime},
        Expiration,
    },
    Cookie, Cookies,
};
use yanniang_domain::value_object::{Handle, Password};

use crate::AppState;

#[derive(Deserialize)]
pub struct LoginRequest {
    handle: String,
    password: String,
}

pub async fn login(
    State(state): State<AppState>,
    cookies: Cookies,
    Json(req): Json<LoginRequest>,
) -> Response {
    let Ok(handle) = Handle::new(req.handle) else {
        return StatusCode::BAD_REQUEST.into_response();
    };

    let Ok(password) = Password::new(&req.password) else {
        // そもそも形式がおかしいパスワードは検証しない
        return StatusCode::UNAUTHORIZED.into_response();
    };

    let session = match state.login.execute(&handle, &password).await {
        Ok(session) => session,
        Err(report) => {
            tracing::error!(?report);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };

    let Some(session) = session else {
        return StatusCode::UNAUTHORIZED.into_response();
    };

    let cookie = Cookie::build(("session_id", session.session_id.to_string()))
        .http_only(true)
        .secure(true)
        .same_site(tower_cookies::cookie::SameSite::Strict)
        .path("/")
        .expires(Expiration::DateTime(
            OffsetDateTime::now_utc() + Duration::days(30),
        ))
        .build();

    cookies.add(cookie);

    StatusCode::OK.into_response()
}
