use async_trait::async_trait;

use crate::{
    model::SessionInfo,
    value_object::{Handle, Password},
};

#[async_trait]
pub trait Login: Send + Sync + 'static {
    async fn execute(
        &self,
        handle: &Handle,
        password: &Password,
    ) -> color_eyre::Result<Option<SessionInfo>>;
}
