use async_trait::async_trait;

use crate::value_object::SessionId;

#[async_trait]
pub trait Logout: Send + Sync + 'static {
    async fn execute(&self, session_id: SessionId) -> color_eyre::Result<()>;
}
