use async_trait::async_trait;
use yanniang_domain::{repository::SessionRepository, usecase::Logout, value_object::SessionId};

pub struct LogoutImpl<SessionRepo>
where
    SessionRepo: SessionRepository,
{
    repo: SessionRepo,
}

impl<SessionRepo> LogoutImpl<SessionRepo>
where
    SessionRepo: SessionRepository,
{
    pub fn new(repo: SessionRepo) -> Self {
        Self { repo }
    }
}

#[async_trait]
impl<SessionRepo> Logout for LogoutImpl<SessionRepo>
where
    SessionRepo: SessionRepository,
{
    #[tracing::instrument(skip(self))]
    async fn execute(&self, session_id: SessionId) -> color_eyre::Result<()> {
        self.repo.delete(session_id).await
    }
}
