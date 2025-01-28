use async_trait::async_trait;

use crate::{command::model::User, value_object::UserId};

#[async_trait]
pub trait UserCommandRepository: Clone + Send + Sync + 'static {
    async fn save(&self, user: User) -> color_eyre::Result<()>;

    async fn remove(&self, user: UserId) -> color_eyre::Result<()>;
}
