use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::value_object::{Handle, Lang, SummaryId, UserId};

#[derive(Debug)]
pub enum Summary {
    Private(PrivateSummary),
    Public(PublicSummary),
}

#[derive(Debug, Clone)]
pub struct PrivateSummary {
    pub id: SummaryId,
    pub uuid: Uuid,
    pub body: String,
    pub lang: Lang,
    pub last_updated_at: DateTime<Utc>,
    pub author_id: UserId,
    pub author_handle: Handle,
    pub author_display_name: String,
}

#[derive(Debug, Clone)]
pub struct PublicSummary {
    pub id: SummaryId,
    pub uuid: Uuid,
    pub body: String,
    pub lang: Lang,
    pub last_updated_at: DateTime<Utc>,
    pub author_id: UserId,
    pub author_handle: Handle,
    pub author_display_name: String,
}
