use async_trait::async_trait;
use color_eyre::eyre::Context;
use sqlx::{
    prelude::FromRow,
    types::chrono::{DateTime, Utc},
    PgPool,
};
use tracing::instrument;
use uuid::Uuid;
use yanniang_domain::{
    model::SessionInfo,
    repository::SessionRepository,
    value_object::{SessionId, UserId},
};

#[derive(Clone)]
pub struct PgSessionRepository {
    pool: PgPool,
}

impl PgSessionRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[derive(FromRow)]
struct SessionRow {
    session_id: Uuid,
    user_id: i32,
    expires_at: DateTime<Utc>,
}

#[async_trait]
impl SessionRepository for PgSessionRepository {
    #[instrument(skip(self))]
    async fn create(
        &self,
        user_id: UserId,
        expires_at: DateTime<Utc>,
    ) -> color_eyre::Result<SessionId> {
        let session_id = sqlx::query_scalar::<_, Uuid>(
            r#"
                INSERT INTO session (session_id, user_id, expires_at, created_at)
                VALUES ($1, $2, $3, $4)
                RETURNING session_id
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(i32::from(user_id))
        .bind(expires_at)
        .bind(Utc::now())
        .fetch_one(&self.pool)
        .await
        .wrap_err("Unexpected error occurred while creating a new session")?;

        Ok(SessionId::new(session_id))
    }

    #[instrument(skip(self))]
    async fn find_by_session_id(
        &self,
        session_id: SessionId,
    ) -> color_eyre::Result<Option<SessionInfo>> {
        let row = sqlx::query_as::<_, SessionRow>(
            r#"
                SELECT session_id, user_id, expires_at
                FROM session
                WHERE session_id = $1
            "#,
        )
        .bind(Uuid::from(session_id))
        .fetch_optional(&self.pool)
        .await
        .wrap_err("Unexpected error occurred while fetching the specified session from DB")?;

        Ok(row.map(|r| SessionInfo {
            session_id: SessionId::new(r.session_id),
            user_id: UserId::new(r.user_id),
            expires_at: r.expires_at,
        }))
    }

    #[instrument(skip(self))]
    async fn delete(&self, session_id: SessionId) -> color_eyre::Result<()> {
        sqlx::query("DELETE FROM session WHERE session_id = $1")
            .bind(Uuid::from(session_id))
            .execute(&self.pool)
            .await
            .wrap_err("Unexpected error occurred while deleting the specified session")?;

        Ok(())
    }
}
