use async_trait::async_trait;
use yanniang_domain::{
    model::SessionInfo, repository::SessionRepository, usecase::VerifySession,
    value_object::SessionId,
};

pub struct VerifySessionImpl<R>
where
    R: SessionRepository,
{
    repo: R,
}

impl<R> VerifySessionImpl<R>
where
    R: SessionRepository,
{
    pub fn new(repo: R) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl<R> VerifySession for VerifySessionImpl<R>
where
    R: SessionRepository,
{
    #[tracing::instrument(skip(self))]
    async fn execute(&self, session_id: SessionId) -> color_eyre::Result<Option<SessionInfo>> {
        self.repo.find_by_session_id(session_id).await
    }
}
