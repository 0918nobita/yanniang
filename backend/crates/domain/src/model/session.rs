use chrono::{DateTime, Utc};

use crate::value_object::{SessionId, UserId};

#[derive(Debug, Clone)]
pub struct SessionInfo {
    pub session_id: SessionId,
    pub user_id: UserId,
    pub expires_at: DateTime<Utc>,
}
