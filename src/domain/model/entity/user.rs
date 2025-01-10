use thiserror::Error;
use unicode_segmentation::UnicodeSegmentation;

use crate::domain::model::value_object::{Handle, UserId};

#[derive(Debug, Clone)]
pub struct User {
    id: UserId,
    handle: Handle,
    display_name: String,
}

#[derive(Debug, Error)]
pub enum InvalidDisplayNameError {
    #[error("display name is empty")]
    Empty,

    #[error("display name is too long")]
    TooLong,
}

impl User {
    pub fn new(
        id: UserId,
        handle: Handle,
        display_name: String,
    ) -> Result<Self, InvalidDisplayNameError> {
        if display_name.is_empty() {
            return Err(InvalidDisplayNameError::Empty);
        }

        if display_name.graphemes(true).count() > 20 {
            return Err(InvalidDisplayNameError::TooLong);
        }

        Ok(Self {
            id,
            handle,
            display_name,
        })
    }

    pub fn id(&self) -> &UserId {
        &self.id
    }

    pub fn handle(&self) -> &Handle {
        &self.handle
    }

    pub fn display_name(&self) -> &str {
        &self.display_name
    }
}

impl PartialEq for User {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for User {}
