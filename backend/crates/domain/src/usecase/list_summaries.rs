use async_trait::async_trait;

use crate::{
    query::model::Summary,
    value_object::{TalkThreadId, UserId},
};

#[async_trait]
pub trait ListSummaries: Send + Sync + 'static {
    async fn execute(
        &self,
        user_id: UserId,
        talk_thread_id: TalkThreadId,
    ) -> color_eyre::Result<Vec<Summary>>;
}
