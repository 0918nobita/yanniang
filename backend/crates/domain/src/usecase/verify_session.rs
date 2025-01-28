use async_trait::async_trait;

use crate::{model::SessionInfo, value_object::SessionId};

#[async_trait]
pub trait VerifySession: Send + Sync + 'static {
    async fn execute(&self, session_id: SessionId) -> color_eyre::Result<Option<SessionInfo>>;
}
