use async_trait::async_trait;
use color_eyre::eyre::Context;
use sqlx::{prelude::FromRow, PgPool};
use yanniang_domain::{
    query::{model::User, repository::UserQueryRepository},
    value_object::{Handle, UserId},
};

#[derive(Clone)]
pub struct PgUserQueryRepository {
    pool: PgPool,
}

impl PgUserQueryRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[derive(FromRow)]
struct UserRow {
    id: i32,
    display_name: String,
    password_hash: String,
}

#[async_trait]
impl UserQueryRepository for PgUserQueryRepository {
    #[tracing::instrument(skip(self))]
    async fn find_by_handle(&self, handle: &Handle) -> color_eyre::Result<Option<User>> {
        let row = sqlx::query_as::<_, UserRow>(
            r#"SELECT * FROM "user" WHERE handle = $1 AND is_deleted = false"#,
        )
        .bind(handle.to_string())
        .fetch_optional(&self.pool)
        .await
        .wrap_err("Unexpected error occurred while fetching the specified user from DB")?;

        let Some(row) = row else {
            return Ok(None);
        };

        Ok(Some(User::new(
            UserId::new(row.id),
            handle.clone(),
            row.display_name,
            row.password_hash,
        )))
    }
}
