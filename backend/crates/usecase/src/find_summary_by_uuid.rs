use async_trait::async_trait;
use uuid::Uuid;
use yanniang_domain::{
    query::{model::Summary, repository::SummaryQueryRepository},
    usecase::FindSummaryByUuid,
    value_object::UserId,
};

pub struct FindSummaryByUuidImpl<R>
where
    R: SummaryQueryRepository,
{
    repo: R,
}

impl<R> FindSummaryByUuidImpl<R>
where
    R: SummaryQueryRepository,
{
    pub fn new(repo: R) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl<R> FindSummaryByUuid for FindSummaryByUuidImpl<R>
where
    R: SummaryQueryRepository,
{
    #[tracing::instrument(skip(self))]
    async fn execute(
        &self,
        user_id: UserId,
        summary_uuid: Uuid,
    ) -> color_eyre::Result<Option<Summary>> {
        self.repo.find_by_uuid(user_id, summary_uuid).await
    }
}
