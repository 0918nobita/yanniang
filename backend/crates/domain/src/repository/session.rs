use async_trait::async_trait;
use chrono::{DateTime, Utc};

use crate::{
    model::SessionInfo,
    value_object::{SessionId, UserId},
};

#[async_trait]
pub trait SessionRepository: Clone + Send + Sync + 'static {
    async fn create(
        &self,
        user_id: UserId,
        expires_at: DateTime<Utc>,
    ) -> color_eyre::Result<SessionId>;

    async fn find_by_session_id(
        &self,
        session_id: SessionId,
    ) -> color_eyre::Result<Option<SessionInfo>>;

    async fn delete(&self, session_id: SessionId) -> color_eyre::Result<()>;
}
