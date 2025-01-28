/*
use thiserror::Error;
use unicode_segmentation::UnicodeSegmentation;

use crate::value_object::comment_id::CommentId;

use super::user::User;

#[derive(Debug, Clone)]
pub struct Comment {
    id: CommentId,
    body: String,
    author: User,
}

#[derive(Debug, Error)]
pub enum CommentInvalidBodyError {
    #[error("body is empty")]
    Empty,

    #[error("body is too long")]
    TooLong,
}

fn validate_body(body: &str) -> Result<(), CommentInvalidBodyError> {
    if body.is_empty() {
        return Err(CommentInvalidBodyError::Empty);
    }

    if body.graphemes(true).count() > 140 {
        return Err(CommentInvalidBodyError::TooLong);
    }

    Ok(())
}

impl Comment {
    pub fn new(id: CommentId, body: String, author: User) -> Result<Self, CommentInvalidBodyError> {
        validate_body(&body)?;

        Ok(Self { id, body, author })
    }

    pub fn id(&self) -> &CommentId {
        &self.id
    }

    pub fn body(&self) -> &str {
        &self.body
    }

    pub fn change_body(&mut self, body: String) -> Result<(), CommentInvalidBodyError> {
        validate_body(&body)?;

        self.body = body;

        Ok(())
    }

    pub fn author(&self) -> &User {
        &self.author
    }
}

impl PartialEq for Comment {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for Comment {}

#[cfg(test)]
mod tests {
    use crate::{
        command::model::user::User,
        value_object::{comment_id::CommentId, handle::Handle, user_id::UserId},
    };

    use super::{Comment, CommentInvalidBodyError};

    #[test]
    fn test_valid_comment() {
        let res = Comment::new(
            CommentId::new(1),
            "好".repeat(140),
            User::new(
                UserId::new(1),
                Handle::new("test".to_owned()).unwrap(),
                "Test User".to_owned(),
            )
            .unwrap(),
        );

        assert!(res.is_ok());
    }

    #[test]
    fn test_body_empty() {
        let res = Comment::new(
            CommentId::new(1),
            "".to_owned(),
            User::new(
                UserId::new(1),
                Handle::new("test".to_owned()).unwrap(),
                "Test User".to_owned(),
            )
            .unwrap(),
        );

        assert!(matches!(res, Err(CommentInvalidBodyError::Empty)));
    }

    #[test]
    fn test_body_too_long() {
        let res = Comment::new(
            CommentId::new(1),
            "a".repeat(141),
            User::new(
                UserId::new(1),
                Handle::new("test".to_owned()).unwrap(),
                "Test User".to_owned(),
            )
            .unwrap(),
        );

        assert!(matches!(res, Err(CommentInvalidBodyError::TooLong)));
    }
}
*/
