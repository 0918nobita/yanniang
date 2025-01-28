use argon2::{Argon2, PasswordVerifier};
use async_trait::async_trait;
use chrono::{Duration, Utc};
use yanniang_domain::{
    model::SessionInfo,
    query::repository::UserQueryRepository,
    repository::SessionRepository,
    usecase::Login,
    value_object::{Handle, Password},
};

pub struct LoginImpl<SessionRepo, UserRepo>
where
    SessionRepo: SessionRepository,
    UserRepo: UserQueryRepository,
{
    session_repo: SessionRepo,
    user_repo: UserRepo,
}

impl<SessionRepo, UserRepo> LoginImpl<SessionRepo, UserRepo>
where
    SessionRepo: SessionRepository,
    UserRepo: UserQueryRepository,
{
    pub fn new(session_repo: SessionRepo, user_repo: UserRepo) -> Self {
        Self {
            session_repo,
            user_repo,
        }
    }
}

#[async_trait]
impl<SessionRepo, UserRepo> Login for LoginImpl<SessionRepo, UserRepo>
where
    SessionRepo: SessionRepository,
    UserRepo: UserQueryRepository,
{
    #[tracing::instrument(skip(self, password))]
    async fn execute(
        &self,
        handle: &Handle,
        password: &Password,
    ) -> color_eyre::Result<Option<SessionInfo>> {
        tracing::debug!("Execute login usecase");
        let user = self.user_repo.find_by_handle(handle).await?;

        tracing::debug!("Result: {:?}", user);
        let Some(user) = user else {
            return Ok(None);
        };

        tracing::debug!("A");

        let password_hash = user.password_hash()?;

        tracing::debug!("B");

        if Argon2::default()
            .verify_password(password.to_string().as_bytes(), &password_hash)
            .is_err()
        {
            return Ok(None);
        }

        tracing::debug!("C");

        let expires_at = Utc::now() + Duration::days(30);

        let session_id = self.session_repo.create(user.id, expires_at).await?;

        Ok(Some(SessionInfo {
            session_id,
            user_id: user.id,
            expires_at,
        }))
    }
}
