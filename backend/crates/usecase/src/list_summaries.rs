use async_trait::async_trait;
use yanniang_domain::{
    query::{model::Summary, repository::SummaryQueryRepository},
    usecase::ListSummaries,
    value_object::{TalkThreadId, UserId},
};

pub struct ListSummariesImpl<R>
where
    R: SummaryQueryRepository,
{
    repo: R,
}

impl<R> ListSummariesImpl<R>
where
    R: SummaryQueryRepository,
{
    pub fn new(repo: R) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl<R> ListSummaries for ListSummariesImpl<R>
where
    R: SummaryQueryRepository,
{
    #[tracing::instrument(skip(self))]
    async fn execute(
        &self,
        user_id: UserId,
        talk_thread_id: TalkThreadId,
    ) -> color_eyre::Result<Vec<Summary>> {
        self.repo.list(user_id, talk_thread_id).await
    }
}
