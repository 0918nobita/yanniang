use async_trait::async_trait;
use uuid::Uuid;

use crate::{query::model::Summary, value_object::UserId};

#[async_trait]
pub trait FindSummaryByUuid: Send + Sync + 'static {
    async fn execute(
        &self,
        user_id: UserId,
        summary_uuid: Uuid,
    ) -> color_eyre::Result<Option<Summary>>;
}
