use async_trait::async_trait;

use crate::{query::model::User, value_object::Handle};

#[async_trait]
pub trait UserQueryRepository: Clone + Send + Sync + 'static {
    async fn find_by_handle(&self, handle: &Handle) -> color_eyre::Result<Option<User>>;
}
