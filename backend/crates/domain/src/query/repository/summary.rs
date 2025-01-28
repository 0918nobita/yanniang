use async_trait::async_trait;
use uuid::Uuid;

use crate::{
    query::model::Summary,
    value_object::{TalkThreadId, UserId},
};

#[async_trait]
pub trait SummaryQueryRepository: Clone + Send + Sync + 'static {
    async fn list(
        &self,
        user_id: UserId,
        talk_thread_id: TalkThreadId,
    ) -> color_eyre::Result<Vec<Summary>>;

    async fn find_by_uuid(
        &self,
        user_id: UserId,
        summary_uuid: Uuid,
    ) -> color_eyre::Result<Option<Summary>>;
}
