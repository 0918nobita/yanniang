use thiserror::Error;

/// ユーザーを識別するための短い文字列で、URLで用いる
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Handle(String);

#[derive(Debug, Error)]
pub enum HandleError {
    #[error("Handle is empty")]
    Empty,

    #[error("Handle contains invalid character(s)")]
    CharIsInvalid,

    #[error("Handle is too long")]
    TooLong { contains_invalid_char: bool },

    #[error("Handle is too short")]
    TooShort { contains_invalid_char: bool },
}

impl Handle {
    #[tracing::instrument]
    pub fn new(handle: String) -> Result<Self, HandleError> {
        if handle.is_empty() {
            return Err(HandleError::Empty);
        }

        let contains_invalid_char = handle
            .chars()
            .any(|c| !c.is_ascii_alphanumeric() && c != '_');

        let len = handle.len();

        if len < 4 {
            return Err(HandleError::TooShort {
                contains_invalid_char,
            });
        }

        if len > 15 {
            return Err(HandleError::TooLong {
                contains_invalid_char,
            });
        }

        Ok(Self(handle))
    }
}

impl std::fmt::Display for Handle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}
