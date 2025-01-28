use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use yanniang_domain::{query::model::Summary, value_object::UserId};

use crate::{auth::AuthenticatedUser, AppState};

#[derive(Debug, Deserialize)]
pub struct FindSummaryByUuidParams {
    summary_uuid: String,
}

#[derive(Debug, Serialize)]
struct Success {
    id: i32,
    uuid: String,
    is_private: bool,
    body: String,
    lang: String,
    last_updated_at: DateTime<Utc>,
    author_id: i32,
    author_handle: String,
    author_display_name: String,
}

#[tracing::instrument(skip(state))]
pub async fn find_by_uuid(
    _: AuthenticatedUser,
    State(state): State<AppState>,
    Path(params): Path<FindSummaryByUuidParams>,
) -> Response {
    let Ok(uuid) = Uuid::parse_str(&params.summary_uuid) else {
        return StatusCode::NOT_FOUND.into_response();
    };

    let usecase = Arc::clone(&state.find_summary_by_uuid);

    let res = usecase.execute(UserId::new(1), uuid).await;

    match res {
        Ok(Some(Summary::Private(private_summary))) => (
            StatusCode::OK,
            Json(Success {
                id: private_summary.id.into(),
                uuid: private_summary.uuid.to_string(),
                is_private: true,
                body: private_summary.body,
                lang: private_summary.lang.to_string(),
                last_updated_at: private_summary.last_updated_at,
                author_id: private_summary.author_id.into(),
                author_handle: private_summary.author_handle.to_string(),
                author_display_name: private_summary.author_display_name.to_string(),
            }),
        )
            .into_response(),
        Ok(Some(Summary::Public(public_summary))) => (
            StatusCode::OK,
            Json(Success {
                id: public_summary.id.into(),
                uuid: public_summary.uuid.to_string(),
                is_private: false,
                body: public_summary.body,
                lang: public_summary.lang.to_string(),
                last_updated_at: public_summary.last_updated_at,
                author_id: public_summary.author_id.into(),
                author_handle: public_summary.author_handle.to_string(),
                author_display_name: public_summary.author_display_name.to_string(),
            }),
        )
            .into_response(),
        Ok(None) => StatusCode::NOT_FOUND.into_response(),
        Err(report) => {
            tracing::error!("{}", report);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
