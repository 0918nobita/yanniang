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
    query::{
        model::{PrivateSummary, PublicSummary, Summary},
        repository::SummaryQueryRepository,
    },
    value_object::{Handle, Lang, SummaryId, TalkThreadId, UserId},
};

#[derive(Debug, FromRow)]
struct SummaryRow {
    pub id: i32,
    pub uuid: Uuid,
    pub is_private: bool,
    pub author_id: i32,
    pub body: String,
    pub lang: String,
    pub author_display_name: String,
    pub author_handle: String,
    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Clone)]
pub struct PgSummaryQueryRepository {
    pool: PgPool,
}

impl PgSummaryQueryRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl SummaryQueryRepository for PgSummaryQueryRepository {
    #[instrument(skip(self))]
    async fn list(
        &self,
        user_id: UserId,
        talk_thread_id: TalkThreadId,
    ) -> color_eyre::Result<Vec<Summary>> {
        let rows = sqlx::query_as::<_, SummaryRow>(
            r#"
                SELECT
                    s.id AS id,
                    s.uuid AS uuid,
                    s.is_private AS is_private,
                    s.author_id AS author_id,
                    s.body AS body,
                    s.lang AS lang,
                    u.display_name AS author_display_name,
                    u.handle AS author_handle,
                    s.created_at AS created_at,
                    s.modified_at AS modified_at
                FROM summary s
                INNER JOIN "user" u ON u.id = s.author_id
                WHERE thread_id = $1 AND (is_private = false OR (is_private = true AND author_id = $2))
            "#)
            .bind(i32::from(talk_thread_id))
            .bind(i32::from(user_id))
            .fetch_all(&self.pool)
            .await.wrap_err("Unexpected error occurred while fetching summaries from DB")?;

        let mut summaries = Vec::new();

        for row in rows {
            let lang = Lang::try_from(row.lang.as_str())
                .wrap_err_with(|| format!("Failed to parse the Lang stored in DB: {}", row.lang))?;

            let author_handle = Handle::new(row.author_handle.clone()).wrap_err_with(|| {
                format!(
                    "Failed to parse the Handle stored in DB: {}",
                    row.author_handle
                )
            })?;

            summaries.push(if row.is_private {
                Summary::Private(PrivateSummary {
                    id: SummaryId::new(row.id),
                    uuid: row.uuid,
                    body: row.body,
                    lang,
                    last_updated_at: row.modified_at.unwrap_or(row.created_at),
                    author_id: UserId::new(row.author_id),
                    author_handle,
                    author_display_name: row.author_display_name,
                })
            } else {
                Summary::Public(PublicSummary {
                    id: SummaryId::new(row.id),
                    uuid: row.uuid,
                    body: row.body,
                    lang,
                    last_updated_at: row.modified_at.unwrap_or(row.created_at),
                    author_id: UserId::new(row.author_id),
                    author_handle,
                    author_display_name: row.author_display_name,
                })
            });
        }

        Ok(summaries)
    }

    #[instrument(skip(self))]
    async fn find_by_uuid(
        &self,
        user_id: UserId,
        summary_uuid: Uuid,
    ) -> color_eyre::Result<Option<Summary>> {
        let row = sqlx::query_as::<_, SummaryRow>(
            r#"
                SELECT
                    s.id AS id,
                    s.uuid AS uuid,
                    s.is_private AS is_private,
                    s.author_id AS author_id,
                    s.body AS body,
                    s.lang AS lang,
                    u.display_name AS author_display_name,
                    u.handle AS author_handle,
                    s.created_at AS created_at,
                    s.modified_at AS modified_at
                FROM summary s
                INNER JOIN "user" u ON u.id = s.author_id
                WHERE
                    uuid = $2
                    AND ((author_id = $1 AND is_private = true) OR is_private = false)
            "#,
        )
        .bind(i32::from(user_id))
        .bind(summary_uuid)
        .fetch_optional(&self.pool)
        .await
        .wrap_err("Unexpected error occurred while fetching the specified summary from DB")?;

        let Some(row) = row else {
            return Ok(None);
        };

        let lang = Lang::try_from(row.lang.as_str())
            .wrap_err_with(|| format!("Failed to parse the Lang stored in DB: {}", row.lang))?;

        let author_handle = Handle::new(row.author_handle.clone()).wrap_err_with(|| {
            format!(
                "Failed to parse the Handle stored in DB: {}",
                row.author_handle
            )
        })?;

        Ok(Some(if row.is_private {
            Summary::Private(PrivateSummary {
                id: SummaryId::new(row.id),
                uuid: row.uuid,
                body: row.body,
                lang,
                last_updated_at: row.modified_at.unwrap_or(row.created_at),
                author_id: UserId::new(row.author_id),
                author_handle,
                author_display_name: row.author_display_name,
            })
        } else {
            Summary::Public(PublicSummary {
                id: SummaryId::new(row.id),
                uuid: row.uuid,
                body: row.body,
                lang,
                last_updated_at: row.modified_at.unwrap_or(row.created_at),
                author_id: UserId::new(row.author_id),
                author_handle,
                author_display_name: row.author_display_name,
            })
        }))
    }
}
