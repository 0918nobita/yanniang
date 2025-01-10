use thiserror::Error;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Handle(String);

#[derive(Debug, Error)]
pub enum InvalidHandleError {
    #[error("handle is empty")]
    Empty,

    #[error("handle contains invalid character(s)")]
    CharIsInvalid,

    #[error("handle is too long")]
    TooLong { contains_invalid_char: bool },

    #[error("handle is too short")]
    TooShort { contains_invalid_char: bool },
}

impl Handle {
    pub fn new(handle: String) -> Result<Self, InvalidHandleError> {
        if handle.is_empty() {
            return Err(InvalidHandleError::Empty);
        }

        let contains_invalid_char = handle
            .chars()
            .any(|c| !c.is_ascii_alphanumeric() && c != '_');

        let len = handle.len();

        if len < 4 {
            return Err(InvalidHandleError::TooShort {
                contains_invalid_char,
            });
        }

        if len > 15 {
            return Err(InvalidHandleError::TooLong {
                contains_invalid_char,
            });
        }

        Ok(Self(handle))
    }
}
