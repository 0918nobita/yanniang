use std::sync::Arc;

use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use yanniang_domain::value_object::TalkThreadId;

use crate::{auth::AuthenticatedUser, AppState};

// TODO: ログイン済みのユーザーのみが自分用のリストを取得できるようにする
#[tracing::instrument(skip(state))]
pub async fn list_summaries(user: AuthenticatedUser, State(state): State<AppState>) -> Response {
    let usecase = Arc::clone(&state.list_summaries);

    match usecase.execute(user.user_id, TalkThreadId::new(1)).await {
        Ok(summaries) => (StatusCode::OK, format!("{summaries:?}")).into_response(),
        Err(report) => {
            tracing::error!(?report);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
