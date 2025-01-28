/*
use thiserror::Error;
use unicode_segmentation::UnicodeSegmentation;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TalkThreadTitle(String);

#[derive(Debug, Error)]
pub enum TalkThreadInvalidTitleError {
    #[error("Too short title")]
    TooShort,

    #[error("Too long title")]
    TooLong,
}

impl TalkThreadTitle {
    pub fn new(title: String) -> Result<Self, TalkThreadInvalidTitleError> {
        let len = title.graphemes(true).count();

        if len < 5 {
            return Err(TalkThreadInvalidTitleError::TooShort);
        }

        if len > 140 {
            return Err(TalkThreadInvalidTitleError::TooLong);
        }

        Ok(Self(title))
    }
}

impl From<TalkThreadTitle> for String {
    fn from(value: TalkThreadTitle) -> Self {
        value.0
    }
}
*/
