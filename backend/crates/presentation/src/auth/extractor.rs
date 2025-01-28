use std::sync::Arc;

use axum::{
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
    response::{IntoResponse, Response},
    RequestPartsExt,
};
use chrono::Utc;
use tower_cookies::Cookies;
use uuid::Uuid;
use yanniang_domain::{
    usecase::VerifySession,
    value_object::{SessionId, UserId},
};

#[derive(Debug)]
pub struct AuthenticatedUser {
    pub user_id: UserId,
}

pub trait VerifySessionUseCaseProvider {
    fn verify_session(&self) -> Arc<dyn VerifySession>;
}

impl<State> FromRequestParts<State> for AuthenticatedUser
where
    State: VerifySessionUseCaseProvider + Send + Sync,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, state: &State) -> Result<Self, Self::Rejection> {
        let cookies = parts
            .extract::<Cookies>()
            .await
            .map_err(|_| StatusCode::UNAUTHORIZED.into_response())?;

        let Some(cookie) = cookies.get("session_id") else {
            return Err(StatusCode::UNAUTHORIZED.into_response());
        };

        let session_id = cookie.value();

        let Ok(session_id) = Uuid::parse_str(session_id) else {
            tracing::error!("Failed to parse session_id as UUID");
            return Err(StatusCode::UNAUTHORIZED.into_response());
        };

        let session_id = SessionId::new(session_id);

        let session_info = match state.verify_session().execute(session_id).await {
            Ok(session_info) => session_info,
            Err(report) => {
                tracing::error!(?report);
                return Err(StatusCode::INTERNAL_SERVER_ERROR.into_response());
            }
        };

        let Some(session_info) = session_info else {
            return Err(StatusCode::UNAUTHORIZED.into_response());
        };

        if session_info.expires_at < Utc::now() {
            return Err(StatusCode::UNAUTHORIZED.into_response());
        }

        Ok(AuthenticatedUser {
            user_id: session_info.user_id,
        })
    }
}
